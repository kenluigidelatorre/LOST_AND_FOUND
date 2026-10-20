require('dotenv').config();
const app = require('./app');
const db = require('./db');

const PORT = process.env.PORT || 5000;

db.query('SELECT 1')
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error(
      'Cannot connect to PostgreSQL:', error.message,
      '\nCheck DATABASE_URL in backend/.env and run: npm run db:setup'
    );
    process.exit(1);
  });
