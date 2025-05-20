/**
 * organizationModel.js
 * 
 * 📦 Este archivo se encarga de conectarse con la base de datos y traer la información
 * de las compañías (organizations) para el CRM.
 * 
 * 🔍 ¿Qué funciones tiene?
 * - getAllOrganizations: trae la lista completa de compañías.
 * - getOrganizationById: trae los datos de una sola compañía por su ID.
 * - getContactsByCompanyId: trae los contactos asociados a esa compañía.
 * - getLogsByCompanyId: trae el historial de logs y notas para la compañía.
 * - getAllAccountManagers: trae todos los usuarios que tienen el rol de "account_manager"
 * - updateCompanyManager: actualiza el account manager asignado a una compañía
 * 
 * ✅ En esta versión también hacemos un JOIN con la tabla `users` para obtener
 * el nombre del Account Manager asignado a cada compañía.
 */

const pool = require('../database/db');


 /**
 * 🔁 getAllOrganizations()
 *
 * Obtiene la lista completa de compañías registradas en el sistema CRM.
 * Incluye toda la información básica de cada compañía, y además realiza un 
 * LEFT JOIN con la tabla 'users' para traer el nombre e ID del Account Manager
 * asignado a cada una (si existe).
 *
 * Esto permite mostrar directamente en la vista general de compañías (organizations.ejs)
 * quién está a cargo de cada cuenta, sin necesidad de hacer consultas adicionales.
 *
 * 🔗 Devuelve: 
 * - Todos los campos de la tabla 'companies' (c.*)
 * - u.id como account_manager_id
 * - u.username como account_manager_name
 */


async function getAllOrganizations() {
  const result = await pool.query(`
    SELECT 
      c.*,
      u.id AS account_manager_id,
      u.username AS account_manager_name
    FROM companies c
    LEFT JOIN users u ON c.account_manager = u.id
    ORDER BY c.name
  `);
  return result.rows;
}



/**
 * 🔍 Trae una sola compañía por su ID
 * También incluye el nombre y el ID del Account Manager (JOIN con users)
 */
async function getOrganizationById(id) {
  const result = await pool.query(`
    SELECT 
      c.*,
      u.id AS account_manager_id,
      u.username AS account_manager_name
    FROM companies c
    LEFT JOIN users u ON c.account_manager = u.id
    WHERE c.id = $1
  `, [id]);
  return result.rows[0];
}

/**
 * 👥 Trae los contactos asociados a una compañía
 */
async function getContactsByCompanyId(id) {
  const result = await pool.query(`
    SELECT * 
    FROM contacts 
    WHERE company_id = $1 
    ORDER BY last_name
  `, [id]);
  return result.rows;
}

/**
 * 📜 Trae los logs asociados a una compañía
 */
async function getLogsByCompanyId(id) {
  const result = await pool.query(`
    SELECT l.message, l.created_at, u.username AS user_name
    FROM company_logs l
    JOIN users u ON l.user_id = u.id
    WHERE l.company_id = $1
    ORDER BY l.created_at DESC
  `, [id]);
  return result.rows;
}

/**
 * 🧑‍💼 Trae todos los usuarios con rol "account_manager"
 * Esto se usa para llenar el dropdown de asignación
 */
async function getAllAccountManagers() {
  const result = await pool.query(`
    SELECT id, username 
    FROM users 
    WHERE role = 'account_manager'
    ORDER BY username
  `);
  return result.rows;
}

/**
 * 🔁 updateCompanyManager(companyId, managerId)
 * Actualiza el campo `account_manager` de una compañía con un nuevo usuario
 * 
 * @param {number} companyId - ID de la compañía a modificar
 * @param {number} managerId - ID del nuevo account manager
 */
async function updateCompanyManager(companyId, managerId) {
  await pool.query(`
    UPDATE companies 
    SET account_manager = $1 
    WHERE id = $2
  `, [managerId, companyId]);
}


module.exports = {
  getAllOrganizations,
  getOrganizationById,
  getContactsByCompanyId,
  getLogsByCompanyId,
  getAllAccountManagers,
  updateCompanyManager // ✅ Nuevo
};
