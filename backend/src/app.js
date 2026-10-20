require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use((req, res, next) => {
  req.body ??= {};
  next();
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', async (req, res, next) => {
  try {
    await db.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use('/api', require('./routes'));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
