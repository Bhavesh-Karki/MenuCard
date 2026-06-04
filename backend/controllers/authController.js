const crypto = require('crypto');
const pool = require('../database/pool');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function register(req, res) {
  const { name, full_name, email, password, phone_number, address } = req.body;
  const fullName = (full_name || name || '').trim();

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const passwordHash = hashPassword(password);
    const token = createToken();
    const userResult = await pool.query(
      `INSERT INTO users (full_name, email, password, phone_number, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name AS name, email, phone_number, address, created_at`,
      [
        fullName,
        email.trim().toLowerCase(),
        passwordHash,
        phone_number || null,
        address || null,
      ]
    );

    console.log(`✅ Registration successful for email: ${userResult.rows[0].email} (ID: ${userResult.rows[0].id})`);
    return res.status(201).json({ user: userResult.rows[0], token });
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
      `SELECT id, full_name AS name, email, password, phone_number, address, created_at
       FROM users
       WHERE LOWER(email) = LOWER($1) OR LOWER(full_name) = LOWER($1)
       LIMIT 1`,
      [identifier.trim().toLowerCase()]
    );

    const user = userResult.rows[0];

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ message: 'Invalid Username or Password.' });
    }

    const token = createToken();

    console.log(`✅ Login successful for email: ${user.email} (ID: ${user.id})`);
    delete user.password;
    return res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Database error.' });
  }
}

async function logout(req, res) {
  return res.status(204).send();
}

module.exports = { register, login, logout };
