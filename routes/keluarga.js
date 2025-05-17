// routes/keluarga.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();

// helper untuk menjalankan query dengan aman
async function withConnection(fn) {
  const conn = await pool.getConnection();
  try {
    return await fn(conn);
  } finally {
    conn.release();
  }
}

// GET /api/keluarga?nama=xxx
router.get('/', async (req, res) => {
  try {
    const nama = req.query.nama?.trim();
    
    const result = await withConnection(conn => {
      let sql = `SELECT * FROM tbl_PRIBADI`;
      const params = [];

      if (nama) {
        sql += ` WHERE LOWER(NamaLengkap) LIKE ?`;
        params.push(`%${nama.toLowerCase()}%`);
      }
      sql += ` LIMIT 1`;

      return conn.query(sql, params);
    });

    const [rows] = result;
    if (!rows.length) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('DB Error (GET /api/keluarga):', err.code, err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/keluarga
router.post('/', async (req, res) => {
  try {
    const { NamaLengkap, Alamat = null, TanggalLahir = null } = req.body;
    if (!NamaLengkap?.trim()) {
      return res.status(400).json({ error: 'NamaLengkap wajib diisi' });
    }

    const [result] = await withConnection(conn =>
      conn.query(
        `INSERT INTO tbl_PRIBADI (NamaLengkap, Alamat, TanggalLahir) VALUES (?, ?, ?)`,
        [NamaLengkap, Alamat, TanggalLahir]
      )
    );

    res.status(201).json({
      message: 'Data berhasil ditambahkan',
      insertId: result.insertId,
    });
  } catch (err) {
    console.error('DB Error (POST /api/keluarga):', err.code, err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /api/keluarga/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { NamaLengkap, Alamat = null, TanggalLahir = null } = req.body;
    if (!NamaLengkap?.trim()) {
      return res.status(400).json({ error: 'NamaLengkap wajib diisi' });
    }

    const [result] = await withConnection(conn =>
      conn.query(
        `UPDATE tbl_PRIBADI SET NamaLengkap = ?, Alamat = ?, TanggalLahir = ? WHERE id = ?`,
        [NamaLengkap, Alamat, TanggalLahir, id]
      )
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json({ message: 'Data berhasil diupdate' });
  } catch (err) {
    console.error('DB Error (PUT /api/keluarga/:id):', err.code, err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/keluarga/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await withConnection(conn =>
      conn.query(`DELETE FROM tbl_PRIBADI WHERE id = ?`, [id])
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Data tidak ditemukan' });
    }
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    console.error('DB Error (DELETE /api/keluarga/:id):', err.code, err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
