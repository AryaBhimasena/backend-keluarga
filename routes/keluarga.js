import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/keluarga?nama=xxx
router.get('/', async (req, res) => {
  try {
    const nama = req.query.nama || 'Siradzamunir Rahman';

    const sql = `
      SELECT *
      FROM tbl_PRIBADI
      WHERE LOWER(NamaLengkap) LIKE ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [`%${nama.toLowerCase()}%`]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('DB Error (GET /keluarga):', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/keluarga
router.post('/', async (req, res) => {
  try {
    const { NamaLengkap, Alamat = null, TanggalLahir = null } = req.body;

    if (!NamaLengkap || NamaLengkap.trim() === '') {
      return res.status(400).json({ error: 'NamaLengkap wajib diisi' });
    }

    const sql = `
      INSERT INTO tbl_PRIBADI (NamaLengkap, Alamat, TanggalLahir)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.query(sql, [NamaLengkap, Alamat, TanggalLahir]);

    res.status(201).json({ message: 'Data berhasil ditambahkan', insertId: result.insertId });
  } catch (err) {
    console.error('DB Error (POST /keluarga):', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/keluarga/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { NamaLengkap, Alamat = null, TanggalLahir = null } = req.body;

    if (!NamaLengkap || NamaLengkap.trim() === '') {
      return res.status(400).json({ error: 'NamaLengkap wajib diisi' });
    }

    const sql = `
      UPDATE tbl_PRIBADI
      SET NamaLengkap = ?, Alamat = ?, TanggalLahir = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(sql, [NamaLengkap, Alamat, TanggalLahir, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    console.error('DB Error (PUT /keluarga/:id):', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/keluarga/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'DELETE FROM tbl_PRIBADI WHERE id = ?';
    const [result] = await pool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    console.error('DB Error (DELETE /keluarga/:id):', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
