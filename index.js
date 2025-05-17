import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import keluargaRoutes from './routes/keluarga.js';
import healthRoutes from './routes/health.js'; // jika sudah dibuat

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Optional: Logging middleware (simple)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/keluarga', keluargaRoutes);
app.use('/health', healthRoutes); // jika dibuat
app.get('/', (_, res) => {
  res.send('✅ Server is up and running');
});

// Global error handler (optional future-proofing)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Unexpected Server Error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});

export default app; // untuk testing / modular deployment
