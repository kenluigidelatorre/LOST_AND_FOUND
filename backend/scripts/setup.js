// Creates the database (if missing), then runs database/schema.sql and database/seed.sql
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async () => {
  const url = new URL(process.env.DATABASE_URL);
  const dbName = decodeURIComponent(url.pathname.slice(1));
  url.pathname = '/postgres';
  const admin = new Client({ connectionString: url.toString() });
  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (!exists.rowCount) {
    await admin.query(`CREATE DATABASE "${dbName.replace(/"/g, '')}"`);
    console.log(`Created database "${dbName}"`);
  }
  await admin.end();

  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  for (const file of ['schema.sql', 'seed.sql']) {
    await db.query(fs.readFileSync(path.join(__dirname, '../../database', file), 'utf8'));
    console.log(`Ran database/${file}`);
  }
  await db.end();
  console.log('Done. Start the API with: npm run dev');
})().catch((e) => { console.error('Setup failed:', e.message); process.exit(1); });
