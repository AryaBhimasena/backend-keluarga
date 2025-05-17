import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/keluarga?nama=xxx
router.get('/', async (req, res) => {
  try {
    const namaParam = req.query.nama;
    let sql, params;

    if (namaParam) {
      sql = `
        SELECT *
        FROM tbl_PRIBADI
        WHERE LOWER(NamaLengkap) LIKE ?
        LIMIT 1
      `;
      params = [`%${namaParam.toLowerCase()}%`];
    } else {
      sql = `
        SELECT *
        FROM tbl_PRIBADI
        WHERE NamaLengkap = ?
        LIMIT 1
      `;
      params = ['Siradzamunir Rahman'];
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/keluarga
// Body JSON: { NamaLengkap, Alamat, TanggalLahir }
router.post('/', async (req, res) => {
  try {
    const { NamaLengkap, Alamat, TanggalLahir } = req.body;

    if (!NamaLengkap) {
      return res.status(400).json({ error: 'NamaLengkap wajib diisi' });
    }

    const sql = `
      INSERT INTO tbl_PRIBADI (NamaLengkap, Alamat, TanggalLahir)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.query(sql, [NamaLengkap, Alamat || null, TanggalLahir || null]);

    res.status(201).json({ message: 'Data berhasil ditambahkan', insertId: result.insertId });
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/keluarga/:id
// Body JSON: { NamaLengkap, Alamat, TanggalLahir }
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { NamaLengkap, Alamat, TanggalLahir } = req.body;

    if (!NamaLengkap) {
      return res.status(400).json({ error: 'NamaLengkap wajib diisi' });
    }

    const sql = `
      UPDATE tbl_PRIBADI
      SET NamaLengkap = ?, Alamat = ?, TanggalLahir = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(sql, [NamaLengkap, Alamat || null, TanggalLahir || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    console.error('DB Error:', err);
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
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
