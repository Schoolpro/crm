/**
 * authRoute.js
 * 
 * 📌 Este archivo define todas las rutas relacionadas con la autenticación de usuarios.
 * 
 * Incluye:
 * - Login tradicional con email y contraseña.
 * - Logout (cerrar sesión).
 * - Registro de nuevos usuarios (sign up).
 * 
 * ❌ Eliminamos autenticación con Google (Passport).
 * 
 * 🔐 ¿Por qué existe este archivo?
 * Centraliza todo el manejo de usuarios que inician sesión o se registran,
 * ya sea por medio de un formulario propio.
 * 
 * 💡 Está conectado al controlador `authController.js`, donde se encuentra la lógica
 * que procesa los formularios y maneja el acceso a la base de datos.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mostrar formulario de login
router.get('/login', authController.showLogin);

// Procesar login
router.post('/login', authController.loginUser);

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error cerrando sesión');
    }
    res.redirect('/login');
  });
});

// Mostrar formulario de registro
router.get('/register', authController.showRegister);

// Procesar registro de usuario
router.post('/register', authController.registerUser);

module.exports = router;
