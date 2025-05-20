/**
 * userRoute.js
 * 
 * 📁 Ruta principal para el módulo de gestión de usuarios (vista general tipo CRM)
 * 
 * Esta ruta está pensada para mostrar:
 * - La lista general de usuarios (/users)
 * - El detalle de un usuario específico (/users/:id)
 * 
 * 🔄 Vinculada a la vista `users.ejs` y `user-details.ejs`
 * ❗ NO maneja login, registro ni autenticación (eso se gestiona en `authRoute.js`)
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ✅ Vista general de usuarios (lista)
router.get('/', userController.showUsers);

// ✅ Vista de detalle de un usuario individual
router.get('/:id', userController.showUserDetails);

module.exports = router;
