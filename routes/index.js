/**
 * index.js
 * 
 * 📌 Rutas principales del CRM.
 * 
 * 🔄 ¿Qué hace?
 * - GET / → Muestra la landing page si el usuario no está logueado.
 *           Si está logueado, carga y muestra el feed con tareas.
 * - GET /contacts → Muestra los contactos (requiere login).
 * - POST /contacts → Permite crear nuevos contactos (requiere login).
 */

const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');
const taskController = require('../controllers/taskController');
const userModel = require('../models/userModel'); // 👈 necesario para traer todos los usuarios
const { requireLogin } = require('../middlewares/authMiddleware');

/**
 * 🏠 Ruta raíz "/"
 * - Si NO hay sesión activa: muestra landing.ejs.
 * - Si hay sesión activa: obtiene tareas y muestra index.ejs.
 */
router.get('/', async (req, res) => {
  console.log('💾 sesión actual:', req.session.user);

  if (!req.session.user) {
    return res.render('landing', {
      error: null,
      user: null
    });
  }

  try {
    const tasks = await taskController.getAllTasksData(); // 👈 Trae tareas desde el modelo
    const users = await userModel.getAllUsers();          // 👈 Trae usuarios para el formulario

    res.render('index', {
      user: req.session.user,
      tasks,
      users
    });
  } catch (error) {
    console.error('❌ Error cargando tareas en GET /:', error);
    res.status(500).send('Error cargando el feed de tareas.');
  }
});

// 📇 Contactos protegidos por login
router.get('/contacts', requireLogin, contactController.showContacts);
router.post('/contacts', requireLogin, contactController.createContact);

module.exports = router;
