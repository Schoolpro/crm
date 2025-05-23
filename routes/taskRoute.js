/**
 * taskRoute.js
 *
 * 📌 Rutas relacionadas con las tareas del CRM.
 *
 * 🔄 ¿Qué hace?
 * - GET /tasks → Muestra todas las tareas (feed principal).
 * - POST /tasks → Crea una nueva tarea.
 * - POST /tasks/:id/done → Marca una tarea como completada con comentario.
 */

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { requireLogin } = require('../middlewares/authMiddleware'); // Protege rutas para usuarios logueados

// ✅ Feed principal con todas las tareas (tipo social media)
router.get('/', requireLogin, taskController.getAllTasks);

// ✅ Crear una nueva tarea
router.post('/', requireLogin, taskController.createTask);

// ✅ Marcar una tarea como completada (con comentario)
router.post('/:id/done', requireLogin, taskController.markTaskAsDone);

module.exports = router;
