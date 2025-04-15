require('dotenv').config() // ¡Esto siempre va primero!
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // requerido por Render
})

module.exports = pool
