/**
 * taskCommentModel.js
 *
 * 📦 Este archivo maneja todas las operaciones relacionadas con los comentarios
 * de tareas (`task_comments`) en la base de datos.
 *
 * 🔄 ¿Qué permite hacer?
 * - Obtener todos los comentarios asociados a una tarea específica.
 * - Crear un nuevo comentario para una tarea.
 *
 * 🧠 Relación:
 * Cada comentario pertenece a una tarea (`task_id`) y a un usuario (`user_id`).
 * La relación con `tasks` tiene ON DELETE CASCADE, por lo tanto si se elimina la tarea,
 * también se eliminan sus comentarios.
 */

const pool = require('../database/db');

/**
 * 🔍 getCommentsByTaskId(taskId)
 *
 * Devuelve todos los comentarios relacionados a una tarea específica,
 * ordenados desde el más reciente al más antiguo.
 *
 * También incluye el nombre del usuario que hizo el comentario (JOIN con users).
 *
 * @param {number} taskId - ID de la tarea
 * @returns {Promise<Array>} Lista de comentarios
 */
async function getCommentsByTaskId(taskId) {
  const result = await pool.query(`
    SELECT 
      tc.*,
      u.username AS user_name
    FROM task_comments tc
    LEFT JOIN users u ON tc.user_id = u.id
    WHERE tc.task_id = $1
    ORDER BY tc.created_at DESC
  `, [taskId]);

  return result.rows;
}

/**
 * 📝 createComment({ task_id, user_id, comment })
 *
 * Inserta un nuevo comentario en la base de datos para una tarea específica.
 *
 * @param {Object} data - Datos del nuevo comentario
 * @param {number} data.task_id - ID de la tarea
 * @param {number} data.user_id - ID del usuario que comenta
 * @param {string} data.comment - Texto del comentario
 */
async function createComment({ task_id, user_id, comment }) {
  await pool.query(`
    INSERT INTO task_comments (task_id, user_id, comment)
    VALUES ($1, $2, $3)
  `, [task_id, user_id, comment]);
}

module.exports = {
  getCommentsByTaskId,
  createComment
};
