const { Pool, types } = require('pg');

types.setTypeParser(1082, (value) => value); // Keep DATE values as YYYY-MM-DD strings.

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.tx = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = pool;
