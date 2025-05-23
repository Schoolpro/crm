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
 * Crea un nuevo comentario en una tarea.
 */
async function addTaskComment(req, res) {
    const taskId = parseInt(req.params.id);
    const userId = req.session.user?.id;
    const { comment } = req.body;
  
    if (!comment || !userId) {
      return res.status(400).send('Comentario vacío o no autorizado.');
    }
  
    try {
      await taskCommentModel.createComment({
        task_id: taskId,
        user_id: userId,
        comment
      });
  
      res.redirect('/');
    } catch (err) {
      console.error('❌ Error al crear comentario:', err);
      res.status(500).send('Error interno al guardar comentario.');
    }
  }
  
  /**
   * 🔍 getTaskComments(taskId)
   * Devuelve los comentarios de una tarea específica.
   */
  async function getTaskComments(taskId) {
    return await taskCommentModel.getCommentsByTaskId(taskId);
  }
  

module.exports = {
  createTask,
  markTaskAsDone,
  getAllTasks,
  getAllTasksData,
  addTaskComment,       // ✅ nuevo
  getTaskComments       // ✅ nuevo
};
