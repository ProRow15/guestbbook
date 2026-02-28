'use strict';

const Database = require('better-sqlite3');
const path = require('path');

function createDb(dbPath) {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}

const defaultDb = createDb(path.join(__dirname, '..', 'guestbook.db'));

module.exports = { createDb, defaultDb };
