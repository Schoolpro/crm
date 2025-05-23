/**
 * taskRoute.js
 *
 * 📌 Rutas relacionadas con las tareas del CRM.
 *
 * 🔄 ¿Qué hace?
 * - GET /tasks → Muestra todas las tareas (feed principal).
 * - POST /tasks → Crea una nueva tarea.
 * - POST /tasks/:id/done → Marca una tarea como completada con comentario.
 * - POST /tasks/:id/comment → Agrega un comentario a una tarea.
 * - POST /tasks/:id/status → Cambia el estado de una tarea.
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

// ✅ Agregar un comentario tipo Facebook a una tarea
router.post('/:id/comment', requireLogin, taskController.addTaskComment);

// ✅ Cambiar el estado de una tarea (pending, following_up, done)
router.post('/:id/status', requireLogin, taskController.changeTaskStatus);

module.exports = router;
