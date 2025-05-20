/**
 * userModel.js
 *
 * 📦 Este archivo se encarga de obtener información sobre los usuarios desde la base de datos.
 * Aquí no se muestra nada visual, solo se hacen consultas SQL para traer datos reales.
 * 
 * 🧠 ¿Cómo funciona?
 * - Cuando el controlador necesita info (como una lista de usuarios o los detalles de uno),
 *   llama a las funciones de este archivo.
 * - Este archivo se conecta a PostgreSQL y devuelve los datos necesarios.
 */

const pool = require('../database/db');

/**
 * 🔁 getAllUsers()
 * Trae todos los usuarios desde la tabla `users`, ordenados por nombre.
 * Esta función se usa para mostrar la lista general de usuarios.
 */
async function getAllUsers() {
  const result = await pool.query(`
    SELECT id, username, email, role, phone, title, profile_picture_filename
    FROM users
    ORDER BY username
  `);
  return result.rows;
}

/**
 * 🔍 getUserById(id)
 * Trae un único usuario por su ID.
 */
async function getUserById(id) {
  const result = await pool.query(`
    SELECT id, username, email, role, phone, title, profile_picture_filename
    FROM users
    WHERE id = $1
  `, [id]);
  return result.rows[0];
}

/**
 * 🏢 getAssignedCompaniesByUserId(userId)
 * Trae todas las compañías que fueron asignadas a ese usuario como Account Manager.
 */
async function getAssignedCompaniesByUserId(userId) {
  const result = await pool.query(`
    SELECT c.id, c.name, c.phone, c.website
    FROM companies c
    JOIN company_account_managers cam ON cam.company_id = c.id
    WHERE cam.user_id = $1
    ORDER BY c.name
  `, [userId]);
  return result.rows;
}

/**
 * 👤 getAccountManagers()
 * Trae todos los usuarios con el rol 'account_manager' para usarlos en asignación.
 */
async function getAccountManagers() {
  const result = await pool.query(`
    SELECT id, username
    FROM users
    WHERE role = 'account_manager'
    ORDER BY username
  `);
  return result.rows;
}

module.exports = {
  getAllUsers,
  getUserById,
  getAssignedCompaniesByUserId,
  getAccountManagers
};
