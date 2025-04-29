/**
 * authRoute.js
 * 
 * 📌 Este archivo define todas las rutas relacionadas con la autenticación de usuarios.
 * 
 * Incluye:
 * - Login tradicional con email y contraseña.
 * - Logout (cerrar sesión).
 * - Registro de nuevos usuarios (sign up).
 * - Autenticación con Google usando OAuth 2.0.
 * 
 * 🔐 ¿Por qué existe este archivo?
 * Centraliza todo el manejo de usuarios que inician sesión o se registran,
 * ya sea por medio de un formulario propio o con su cuenta de Google.
 * 
 * 💡 Está conectado al controlador `authController.js`, donde se encuentra la lógica
 * que procesa los formularios y maneja el acceso a la base de datos.
 * 
 * También usa Passport.js para manejar sesiones y autenticación con Google.
 */


const passport = require('passport');


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

// ✅ Inicia el login con Google
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ✅ Callback que recibe la respuesta de Google después del login
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res) => {
  // ✅ Guardamos el usuario en sesión manualmente (por si queremos usar req.session)
  req.session.user = {
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    company_id: req.user.company_id
  };

  res.redirect('/'); // 🔁 Redirigimos al dashboard o donde quieras
});
