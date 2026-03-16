'use strict';

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { defaultDb } = require('./db');

const readLimiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

function createApp(db) {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // List all entries as JSON
  app.get('/entries', readLimiter, (req, res) => {
    const entries = db.prepare('SELECT * FROM entries ORDER BY id DESC').all();
    res.json(entries);
  });

  // Add a new entry
  app.post('/entries', writeLimiter, (req, res) => {
    const { name, message } = req.body;
    if (!name || !name.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }
    const info = db.prepare('INSERT INTO entries (name, message) VALUES (?, ?)').run(name.trim(), message.trim());
    res.status(201).json({ id: info.lastInsertRowid });
  });

  return app;
}

module.exports = { createApp };

if (require.main === module) {
  const app = createApp(defaultDb);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Guestbook running on http://localhost:${PORT}`);
  });
}
