const pool = require('../database/db');

async function getAllOrganizations() {
  const result = await pool.query('SELECT * FROM companies ORDER BY name');
  return result.rows;
}

async function getOrganizationById(id) {
    const result = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    return result.rows[0];
  }
  
  async function getContactsByCompanyId(id) {
    const result = await pool.query('SELECT * FROM contacts WHERE company_id = $1 ORDER BY last_name', [id]);
    return result.rows;
  }
  
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
  
  
  
  
  
  
  module.exports = {
    getAllOrganizations,
    getOrganizationById,
    getContactsByCompanyId,
    getLogsByCompanyId
  };
  