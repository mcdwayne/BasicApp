const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  // First, connect to default postgres database to create our database
  const defaultPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    console.log('Connecting to PostgreSQL...');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'address_news_db';
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    
    const dbExists = await defaultPool.query(checkDbQuery, [dbName]);
    
    if (dbExists.rows.length === 0) {
      console.log(`Creating database: ${dbName}`);
      await defaultPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
    
    await defaultPool.end();
    
    // Now connect to our new database and create tables
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: dbName,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });
    
    console.log('Creating tables...');
    
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log('Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.error('Error executing statement:', error.message);
          }
        }
      }
    }
    
    console.log('Database setup completed successfully!');
    await pool.end();
    
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
