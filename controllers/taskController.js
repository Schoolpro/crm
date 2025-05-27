/**
 * taskController.js
 * 
 * 📌 Controlador para manejar tareas del sistema CRM.
 * 
 * 🔄 ¿Qué hace?
 * - Crea nuevas tareas con validación de datos.
 * - Muestra todas las tareas para el feed principal.
 * - Muestra tareas asignadas a un usuario o creadas por él.
 * - Marca tareas como completadas, agregando comentario.
 */

const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel'); // 👈 necesario para traer todos los usuarios
const taskCommentModel = require('../models/taskCommentModel');





/**
 * 🆕 createTask(req, res)
 * Crea una nueva tarea con validación.
 */
async function createTask(req, res) {
  const { title, description, due_date, assigned_to } = req.body;
  const created_by = req.session.user?.id; // 🔄 CAMBIADO de assigned_by a created_by

  // 🛑 Validación de campos requeridos
  if (!title || !created_by) {
    return res.status(400).send('El título y el asignador son obligatorios.');
  }

  try {
    await taskModel.createTask({
      title,
      description,
      due_date,
      assigned_to: assigned_to || null,
      created_by // 🔄 CAMBIADO de assigned_by a created_by
    });

    res.redirect('/'); // Redirige al feed principal o a donde quieras
  } catch (err) {
    console.error('❌ Error al crear tarea:', err);
    res.status(500).send('Error interno al crear tarea.');
  }
}

/**
 * ✅ markTaskAsDone(req, res)
 * Marca una tarea como completada y guarda el comentario del usuario.
 */
async function markTaskAsDone(req, res) {
  const taskId = parseInt(req.params.id);
  const { done_comment } = req.body;

  if (!done_comment || done_comment.trim() === '') {
    return res.status(400).send('Debes ingresar un comentario para completar la tarea.');
  }

  try {
    await taskModel.markTaskAsDone(taskId, done_comment);
    res.redirect('/'); // Redirige al feed principal
  } catch (err) {
    console.error('❌ Error al completar tarea:', err);
    res.status(500).send('Error interno al marcar tarea como hecha.');
  }
}

/**
 * 📋 getAllTasks(req, res)
 * Muestra todas las tareas en la vista principal (tipo feed).
 * También pasa todos los usuarios para el formulario de creación de tareas.
 */
async function getAllTasks(req, res) {
  try {
    const tasks = await taskModel.getAllTasks();
    const users = await userModel.getAllUsers(); // 👈 esto es lo nuevo

    res.render('index', {
      tasks,
      users // 👈 ahora lo mandamos a la vista
    });
  } catch (err) {
    console.error('❌ Error al cargar tareas:', err);
    res.status(500).send('Error interno al cargar tareas.');
  }
}

async function getAllTasksData() {
  return await taskModel.getAllTasks();
}

/**
 * 💬 addTaskComment(req, res)
 * Guarda un nuevo comentario para una tarea.
 */
async function addTaskComment(req, res) {
    const taskId = parseInt(req.params.id);
    const userId = req.session.user?.id;
    const { comment } = req.body;
  
    if (!comment || comment.trim() === '') {
      return res.status(400).send('El comentario no puede estar vacío.');
    }
  
    try {
      await taskModel.addTaskComment(taskId, userId, comment);
      res.redirect('/'); // Redirige al feed principal
    } catch (err) {
      console.error('❌ Error al agregar comentario:', err);
      res.status(500).send('Error interno al agregar comentario.');
    }
  }
  
  /**
 * 🔄 changeTaskStatus(req, res)
 *
 * Cambia el estado de una tarea (pending, following_up, done).
 * Validación básica para permitir solo valores específicos.
 */
async function changeTaskStatus(req, res) {
    const taskId = parseInt(req.params.id);
    const { status } = req.body;
  
    const allowedStatuses = ['pending', 'following_up', 'done'];
  
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send('Estado no permitido.');
    }
  
    try {
      await taskModel.changeTaskStatus(taskId, status);
      res.redirect('/'); // Redirige al feed principal después de cambiar el estado
    } catch (err) {
      console.error('❌ Error al cambiar estado:', err);
      res.status(500).send('Error interno al cambiar el estado de la tarea.');
    }
  }
  



  module.exports = {
    createTask,
    markTaskAsDone,
    getAllTasks,
    getAllTasksData,
    addTaskComment,
    changeTaskStatus    // ✅ NUEVO: ¡agregalo aquí!
  };
  
