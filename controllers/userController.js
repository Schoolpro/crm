/**
 * userController.js
 *
 * 📌 Este archivo controla todo lo relacionado con los usuarios (account managers, etc.) del CRM.
 *
 * 🧠 ¿Qué hace?
 * - Muestra la lista de usuarios (usada en la vista `users.ejs`).
 * - Muestra la vista de detalle de un usuario (vista `user-details.ejs`).
 */

const userModel = require('../models/userModel');

/**
 * 🔍 Muestra la lista general de usuarios.
 * Se renderiza en la vista `users.ejs`.
 */
async function showUsers(req, res, next) {
  try {
    console.log('👉 Entrando a showUsers');
    const users = await userModel.getAllUsers();
    res.render('users', { users });
  } catch (error) {
    next(error);
  }
}

/**
 * 📄 Muestra el detalle de un usuario individual, incluyendo sus compañías asignadas.
 * Se renderiza en la vista `user-details.ejs`.
 */
async function showUserDetails(req, res, next) {
  try {
    const userId = req.params.id;
    console.log('🔎 Buscando detalles para el usuario ID:', userId);

    const user = await userModel.getUserById(userId);
    const assignedCompanies = await userModel.getAssignedCompaniesByUserId(userId);

    // Si no encuentra el usuario, renderiza con user = null
    if (!user) {
      return res.status(404).render('user-details', { user: null, assignedCompanies: [] });
    }

    res.render('user-details', { user, assignedCompanies });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showUsers,
  showUserDetails
};
