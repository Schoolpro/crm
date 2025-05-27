/**
 * taskModel.js
 *
 * 📦 Este archivo contiene todas las funciones necesarias para interactuar con la
 * tabla `tasks` de la base de datos.
 *
 * 🔄 ¿Qué permite hacer?
 * - Obtener todas las tareas (para mostrarlas en el feed principal).
 * - Obtener tareas asignadas a un usuario.
 * - Obtener tareas creadas por un usuario.
 * - Crear una nueva tarea.
 * - Marcar una tarea como completada, agregando un comentario.
 *
 * 🧠 Las relaciones con los usuarios están definidas mediante claves foráneas:
 * - `assigned_to`: ID del usuario a quien se le asigna la tarea.
 * - `created_by`: ID del usuario que crea la tarea.
 */

const pool = require('../database/db');
/**
 * 🔍 getAllTasks()
 *
 * Devuelve todas las tareas del sistema, ordenadas por fecha de creación descendente.
 * Incluye los nombres de los usuarios asignados y creadores mediante LEFT JOIN con `users`.
 * También incluye los comentarios asociados desde `task_comments`, con nombre del autor.
 */
async function getAllTasks() {
    // 1. Traer todas las tareas con nombres de usuarios asignados y creadores
    const result = await pool.query(`
      SELECT t.*, 
             u1.username AS assigned_to_name, 
             u2.username AS created_by_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assigned_to = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      ORDER BY t.created_at DESC
    `);
  
    const tasks = result.rows;
  
    // 2. Para cada tarea, traer sus comentarios y agregarlos
    for (let task of tasks) {
      const commentResult = await pool.query(`
        SELECT c.comment, c.created_at, u.username
        FROM task_comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.task_id = $1
        ORDER BY c.created_at ASC
      `, [task.id]);
  
      task.comments = commentResult.rows; // Agrega los comentarios como array a cada tarea
    }
  
    return tasks;
  }
  
/**
 * 🧑‍💻 getTasksAssignedTo(userId)
 *
 * Devuelve todas las tareas asignadas a un usuario específico.
 */
async function getTasksAssignedTo(userId) {
  const result = await pool.query(`
    SELECT * FROM tasks 
    WHERE assigned_to = $1 
    ORDER BY created_at DESC
  `, [userId]);
  return result.rows;
}

/**
 * 🧾 getTasksCreatedBy(userId)
 *
 * Devuelve todas las tareas que fueron creadas por un usuario específico.
 */
async function getTasksCreatedBy(userId) {
  const result = await pool.query(`
    SELECT * FROM tasks 
    WHERE created_by = $1 
    ORDER BY created_at DESC
  `, [userId]);
  return result.rows;
}

/**
 * 🆕 createTask({ title, description, due_date, assigned_to, created_by })
 *
 * Crea una nueva tarea en la base de datos.
 */
async function createTask({ title, description, due_date, assigned_to, created_by }) {
  await pool.query(`
    INSERT INTO tasks (title, description, due_date, assigned_to, created_by)
    VALUES ($1, $2, $3, $4, $5)
  `, [title, description, due_date, assigned_to, created_by]);
}

/**
 * ✅ markTaskAsDone(taskId, doneComment)
 *
 * Marca una tarea como completada y guarda el comentario de cierre.
 */
async function markTaskAsDone(taskId, doneComment) {
  await pool.query(`
    UPDATE tasks
    SET is_done = true,
        completed_comment = $1,
        completed_at = NOW()
    WHERE id = $2
  `, [doneComment, taskId]);
}


/**
 * 💬 addTaskComment(taskId, userId, comment)
 *
 * Guarda un nuevo comentario para una tarea específica.
 */
async function addTaskComment(taskId, userId, comment) {
    await pool.query(`
      INSERT INTO task_comments (task_id, user_id, comment)
      VALUES ($1, $2, $3)
    `, [taskId, userId, comment]);
  }

  /**
 * 🔄 changeTaskStatus(taskId, newStatus)
 *
 * Cambia el estado (`status`) de una tarea en la base de datos.
 * También actualiza `status_updated_at` con la fecha y hora actual.
 *
 * @param {number} taskId - ID de la tarea a actualizar.
 * @param {string} newStatus - Nuevo estado (pending, following_up, done).
 */
async function changeTaskStatus(taskId, newStatus) {
    await pool.query(`
      UPDATE tasks
      SET status = $1,
          status_updated_at = NOW()
      WHERE id = $2
    `, [newStatus, taskId]);
  }
  
  module.exports = {
    getAllTasks,
    getTasksAssignedTo,
    getTasksCreatedBy,
    createTask,
    markTaskAsDone,
    addTaskComment,       // ⚠️ asegúrate de tener esta línea
    changeTaskStatus      // ✅ NUEVO: ¡agregala aquí!
  };
  
  



