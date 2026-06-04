require('dotenv').config();

const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('sslmode=require') || process.env.DATABASE_URL.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : false,
  });
} else {
  const requiredEnv = ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGPORT'];
  const missingEnv = requiredEnv.filter(key => !process.env[key]);

  if (missingEnv.length) {
    throw new Error(`Missing database environment variables: ${missingEnv.join(', ')}`);
  }

  pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: Number(process.env.PGPORT),
  });
}

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    const dbInfo = process.env.DATABASE_URL ? 'Neon Cloud Database' : `"${process.env.PGDATABASE}" at ${process.env.PGHOST}:${process.env.PGPORT}`;
    console.log(`✅ Database connection successful! Connected to ${dbInfo}`);
  }
});

module.exports = pool;
