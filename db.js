// db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Log env DB untuk debugging
console.log('▶️  DB_HOST:', process.env.DB_HOST);
console.log('▶️  DB_USER:', process.env.DB_USER);
console.log('▶️  DB_NAME:', process.env.DB_NAME);
console.log('▶️  DB_PORT:', process.env.DB_PORT);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

(async () => {
  try {
    // Coba ambil dan release satu koneksi
    const conn = await pool.getConnection();
    await conn.ping();      // atau conn.query('SELECT 1');
    conn.release();
    console.log('✅ DB pool ready (ping successful)');
  } catch (err) {
    console.error('❌ DB pool initialization failed:', err.code, err.message);
    // Kalau mau paksa crash supaya Railway re-deploy:
    process.exit(1);
  }
})();

export default pool;
