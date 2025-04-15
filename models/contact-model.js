const pool = require('../database/db')

// Insertar un contacto
async function createContact(data) {
  const { company_id, first_name, last_name, phone, email, title, linkedin } = data
  const sql = `
    INSERT INTO contacts (company_id, first_name, last_name, phone, email, title, linkedin)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `
  const values = [company_id, first_name, last_name, phone, email, title, linkedin]
  const result = await pool.query(sql, values)
  return result.rows[0]
}

// Traer todos los contactos
async function getAllContacts() {
  const result = await pool.query('SELECT * FROM contacts')
  return result.rows
}

module.exports = { createContact, getAllContacts }
