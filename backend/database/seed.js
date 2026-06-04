const fs = require('fs');
const path = require('path');
const pool = require('./pool');

const seedDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log(`Reading schema file from ${schemaPath}...`);
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Connecting to database and clearing old tables...');
    await pool.query('DROP TABLE IF EXISTS user_order_history, orders_history, food_items, categories, users CASCADE;');
    
    console.log('Running schema.sql...');
    await pool.query(sql);
    console.log('✅ Database schema reset and applied successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.detail) {
      console.error(`Detail: ${error.detail}`);
    }
  } finally {
    await pool.end();
    console.log('Database pool connection closed.');
  }
};

seedDatabase();
