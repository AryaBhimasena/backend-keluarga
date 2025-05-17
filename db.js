import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, // biar antrian tidak dibatasi, bisa kamu atur nanti
  connectTimeout: 10000, // timeout koneksi 10 detik
});

// Misalnya di file db.js
connection.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek DB:', err.message);
    process.exit(1); // jangan biarkan lanjut jika DB gagal
  } else {
    console.log('✅ Koneksi ke database berhasil');
  }
});

export default pool;
