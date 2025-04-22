const express = require('express');
const router = express.Router();
const pool = require('../database/db'); // conexión a PostgreSQL

router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  try {
    const result = await pool.query(
      `SELECT first_name, last_name, email
       FROM contacts
       WHERE LOWER(first_name) LIKE LOWER($1)
          OR LOWER(last_name) LIKE LOWER($1)
       LIMIT 5`,
      [`%${query}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
