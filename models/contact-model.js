/**
 * contact-model.js
 *
 * 📌 Este archivo maneja todas las operaciones de base de datos relacionadas con los contactos.
 * 
 * 📋 Contiene:
 * - createContact(data): Inserta un nuevo contacto en la base de datos.
 * - getAllContacts(): Trae todos los contactos junto con el nombre de la empresa (JOIN con companies).
 *
 * 🔗 Este módulo es utilizado por el controlador (contactController.js) para mostrar y agregar contactos.
 * Se conecta directamente a la base de datos PostgreSQL mediante el pool de conexiones.
 */

const pool = require('../database/db')

/**
 * 📝 createContact(data)
 * Inserta un nuevo contacto en la tabla `contacts`.
 * 
 * @param {Object} data - Datos del contacto (extraídos del formulario).
 * @returns {Object} - El contacto recién insertado, como objeto JS.
 */
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

/**
 * 📋 getAllContacts()
 * Trae todos los contactos desde la base de datos, incluyendo el nombre de la empresa asociada.
 * Usa una consulta SQL con INNER JOIN para obtener el nombre de la compañía (companies.name).
 * 
 * @returns {Array} - Lista de contactos, cada uno con la info + el campo `company_name`.
 */
async function getAllContacts() {
  const result = await pool.query(`
    SELECT contacts.*, companies.name AS company_name
    FROM contacts
    INNER JOIN companies ON contacts.company_id = companies.id
    ORDER BY contacts.first_name
  `)
  return result.rows
}

module.exports = {
  createContact,
  getAllContacts
}
