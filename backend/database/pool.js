require('dotenv').config();

const { Pool } = require('pg');

const requiredEnv = ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGPORT'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length) {
  throw new Error(`Missing database environment variables: ${missingEnv.join(', ')}`);
}

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});

module.exports = pool;
