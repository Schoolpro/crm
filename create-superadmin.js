require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./database/db'); // ✅ BIEN (según tu estructura)



async function createSuperAdmin() {
  const email = 'alan@example.com';
  const username = 'alan';
  const plainPassword = 'mipasswordsegura123';
  const role = 'superadmin';

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const result = await pool.query(
      `INSERT INTO users (company_id, email, username, password, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [null, email, username, hashedPassword, role]
    );

    console.log('✅ Superadmin creado:', result.rows[0]);
    process.exit();
  } catch (err) {
    console.error('❌ Error al crear superadmin:', err);
    process.exit(1);
  }
}

createSuperAdmin();
