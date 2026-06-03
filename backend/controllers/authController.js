const crypto = require('crypto');
const pool = require('../database/pool');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const passwordHash = hashPassword(password);
    const token = createToken();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const userResult = await client.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [name, email.toLowerCase(), passwordHash]
      );
      await client.query(
        `INSERT INTO user_sessions (user_id, token)
         VALUES ($1, $2)`,
        [userResult.rows[0].id, token]
      );
      await client.query('COMMIT');

      return res.status(201).json({ user: userResult.rows[0], token });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    console.error('Register error:', error);
    return res.status(500).json({ message: 'Database error.' });
  }
}

async function login(req, res) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required.' });
  }

  try {
    const userResult = await pool.query(
      `SELECT id, name, email, password_hash, created_at
       FROM users
       WHERE email = $1 OR LOWER(name) = LOWER($1)
       LIMIT 1`,
      [identifier.toLowerCase()]
    );

    const user = userResult.rows[0];

    if (!user || user.password_hash !== hashPassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = createToken();
    await pool.query(
      `INSERT INTO user_sessions (user_id, token)
       VALUES ($1, $2)`,
      [user.id, token]
    );

    delete user.password_hash;
    return res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Database error.' });
  }
}

async function logout(req, res) {
  const { token } = req.body;

  if (token) {
    await pool.query('DELETE FROM user_sessions WHERE token = $1', [token]).catch(() => {});
  }

  return res.status(204).send();
}

module.exports = { register, login, logout };
