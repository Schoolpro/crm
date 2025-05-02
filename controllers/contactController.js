/**
 * contactController.js
 * 
 * 📌 Este archivo define la lógica del lado del servidor para manejar los contactos (contacts).
 * Es el intermediario entre las rutas y el modelo de base de datos.
 * 
 * Incluye:
 * - Mostrar la vista con todos los contactos registrados.
 * - Insertar nuevos contactos usando datos enviados por el usuario.
 * 
 * ⚙️ ¿Qué hace cada parte?
 * 1. showContacts(): Recupera todos los contactos desde la base de datos, así como la lista de compañías, 
 *    y luego muestra la vista 'contacts.ejs'. Sirve para mostrar los contactos ya guardados 
 *    y permitir que el usuario agregue nuevos, eligiendo la compañía desde un menú desplegable.
 * 
 * 2. createContact(): Recibe los datos del formulario POST, y llama al modelo para insertarlos
 *    en la tabla `contacts`. Si todo sale bien, redirige de nuevo a la lista de contactos.
 */

const contactModel = require('../models/contact-model');
const pool = require('../database/db'); // Usamos esto para traer las compañías

// ✅ Mostrar todos los contactos y las compañías disponibles para el formulario
async function showContacts(req, res) {
  try {
    // Trae todos los contactos desde la base de datos
    const contacts = await contactModel.getAllContacts();

    // Trae sólo el ID y nombre de todas las compañías, ordenadas alfabéticamente
    const companiesResult = await pool.query('SELECT id, name FROM companies ORDER BY name ASC');
    const companies = companiesResult.rows;

    // Renderiza la vista 'contacts.ejs' y le pasa los datos
    res.render('contacts', {
      contacts,
      companies,
      user: req.session.user // Para mostrar el nombre y rol del usuario logueado
    });
  } catch (error) {
    console.error('Error al cargar contactos:', error);
    res.status(500).send('Error al cargar la vista de contactos');
  }
}

// ✅ Crear un nuevo contacto a partir del formulario enviado
async function createContact(req, res) {
  try {
    // Llama al modelo para guardar el nuevo contacto en la base de datos
    await contactModel.createContact(req.body);
    res.redirect('/contacts'); // Redirige a la lista después de guardar
  } catch (err) {
    console.error('Error al crear contacto:', err);
    res.status(500).send('Error al crear contacto');
  }
}

module.exports = {
  showContacts,
  createContact
};
