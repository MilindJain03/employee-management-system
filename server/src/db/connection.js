const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Run migrations
const runMigrations = () => {
  const migrationsPath = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsPath).sort();

  migrationFiles.forEach((file) => {
    if (file.endsWith('.sql')) {
      const migrationSQL = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
      db.exec(migrationSQL);
      console.log(`Migration ${file} executed successfully`);
    }
  });
};

// Run migrations on startup
runMigrations();

module.exports = db;
