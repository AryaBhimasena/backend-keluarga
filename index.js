// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';             // import pool Anda
import keluargaRoutes from './routes/keluarga.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/keluarga', keluargaRoutes);
app.use('/health', healthRoutes);

// **DB health check**
app.get('/health/db', async (_, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    res.status(200).json({ status: 'DB OK', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('DB Health Error:', err.code, err.message);
    res.status(500).json({ status: 'DB ERROR', error: err.message });
  }
});

app.get('/', (_, res) => {
  res.send('✅ Server is up and running');
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Unexpected Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
