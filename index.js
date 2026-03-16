'use strict';

const { createApp } = require('./src/app');
const { defaultDb } = require('./src/db');

const app = createApp(defaultDb);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Guestbook running on http://localhost:${PORT}`);
});
