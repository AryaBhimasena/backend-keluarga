// db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Tes koneksi
connection.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek DB:', err.message);
    process.exit(1); // Keluar dari aplikasi jika gagal konek
  } else {
    console.log('✅ Koneksi ke database berhasil');
  }
});

// Ubah ke promise wrapper
const db = connection.promise();

export default connection;
