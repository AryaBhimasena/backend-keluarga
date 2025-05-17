import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import keluargaRoutes from './routes/keluarga.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/keluarga', keluargaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
