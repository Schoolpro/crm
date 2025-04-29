/**
 * authController.js
 * 
 * 📌 Este archivo contiene toda la lógica relacionada con la autenticación de usuarios.
 * Incluye el manejo del login, logout y registro (sign up) de nuevos usuarios.
 * Se comunica con la base de datos PostgreSQL y usa bcrypt para proteger las contraseñas.
 * 
 * 🧠 Funciones incluidas:
 * - showLogin: muestra el formulario de login.
 * - loginUser: procesa el login del usuario.
 * - showRegister: muestra el formulario de registro.
 * - registerUser: procesa el registro del usuario nuevo.
 */

const bcrypt = require('bcryptjs');
const pool = require('../database/db');

// ✅ Ya no pasamos `user` en el render, porque lo maneja res.locals.user desde app.js
async function showLogin(req, res) {
  res.render('login', {
    error: null
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.render('login', {
        error: 'Usuario no encontrado.'
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.render('login', {
        error: 'Contraseña incorrecta.'
      });
    }

    // ✅ Guardamos el usuario en sesión
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      company_id: user.company_id
    };

    res.redirect('/'); // ✅ Redirige al dashboard (index.ejs)

  } catch (err) {
    console.error('Error en login:', err);
    res.render('login', {
      error: 'Error interno.'
    });
  }
}

// ✅ Muestra el formulario de registro
async function showRegister(req, res) {
  res.render('account/register', {
    error: null
  });
}

// ✅ Procesa y registra al nuevo usuario
async function registerUser(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Validaciones básicas del lado del servidor
    if (!account_firstname || !account_lastname || !account_email || !account_password) {
      return res.render('account/register', {
        error: 'Todos los campos son obligatorios.'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [account_email]);
    if (existingUser.rows.length > 0) {
      return res.render('account/register', {
        error: 'El email ya está registrado.'
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Crear el usuario con rol por defecto "Client"
    await pool.query(`
      INSERT INTO users (firstname, lastname, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
    `, [account_firstname, account_lastname, account_email, hashedPassword, 'Client']);

    // Redirigir al login
    res.redirect('/login');

  } catch (err) {
    console.error('Error en registro:', err);
    res.render('account/register', {
      error: 'Error interno.'
    });
  }
}

module.exports = {
  showLogin,
  loginUser,
  showRegister,
  registerUser
};
