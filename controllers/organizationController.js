/**
 * organizationController.js
 *
 * 📌 Este archivo controla la lógica para mostrar organizaciones en el sistema CRM.
 * 
 * 🔄 ¿Qué hace?
 * - Muestra todas las organizaciones registradas.
 * - Muestra los detalles de una organización específica por su ID.
 * - Permite asignar o cambiar el Account Manager desde el detalle de la compañía.
 * 
 * 🧠 Este controlador se comunica con el modelo (organizationModel.js y userModel.js)
 * para obtener y actualizar datos, que luego son enviados a las vistas EJS.
 */

const orgModel = require('../models/organizationModel'); // Modelo para compañías
const userModel = require('../models/userModel');         // Modelo para usuarios

// 📦 Conexión al pool de PostgreSQL
// Este pool se reutiliza para todas las consultas a la base de datos.
const pool = require('../database/db');




/**
 * 🗂 showOrganizations(req, res)
 * Muestra la lista completa de organizaciones + lista de managers
 */
async function showOrganizations(req, res) {
  try {
    const organizations = await orgModel.getAllOrganizations();
    const accountManagers = await userModel.getAccountManagers(); // ✅ nombre corregido
    res.render('organizations', { organizations, accountManagers }); // ✅ enviado con el nuevo nombre
  } catch (err) {
    console.error('Error cargando organizaciones:', err);
    res.status(500).send('Error al cargar organizaciones');
  }
}

/**
 * 🔍 showOrganizationDetails(req, res, next)
 * Muestra los detalles de una sola organización + lista de managers disponibles.
 */
async function showOrganizationDetails(req, res, next) {
  try {
    const organizationId = parseInt(req.params.id);

    const organizationData = await orgModel.getOrganizationById(organizationId);
    const accountManagers = await orgModel.getAllAccountManagers();
    const logs = await orgModel.getLogsByCompanyId(organizationId); // 👈 ESTA LÍNEA ES CLAVE

    if (!organizationData) {
      return res.render('organization-details', {
        organization: null,
        accountManagers: [],
        logs: [] // 👈 ASEGURATE DE INCLUIRLO TAMBIÉN ACÁ
      });
    }

    res.render('organization-details', {
      organization: organizationData,
      accountManagers: accountManagers,
      logs: logs // ✅ 👈 ESTO ES LO QUE TE FALTABA
    });

  } catch (error) {
    console.error('Error en showOrganizationDetails:', error);
    next(error);
  }
}



/**
 * ✅ assignAccountManager(req, res)
 * Asigna o cambia el Account Manager para una compañía específica.
 * Recibe los datos desde un formulario (POST).
 */
async function assignAccountManager(req, res) {
  try {
    const companyId = parseInt(req.params.id);
    const managerId = req.body.account_manager_id === '' ? null : parseInt(req.body.account_manager_id);

    // Solo validamos si se eligió un manager
    if (managerId !== null) {
      const manager = await userModel.getUserById(managerId);
      if (!manager || manager.role !== 'account_manager') {
        return res.status(400).send('❌ Usuario inválido o no autorizado como account manager');
      }
    }
    console.log('➡️ Enviando a DB - companyId:', companyId, 'managerId:', managerId);


    await orgModel.updateCompanyManager(companyId, managerId);

    res.status(200).send('✅ Account Manager actualizado correctamente');
  } catch (error) {
    console.error('❌ Error asignando Account Manager:', error);
    res.status(500).send('Error al asignar el Account Manager');
  }
}



/**
 * 📝 Guarda un nuevo log comercial para una compañía
 * Requiere que el usuario esté logueado
 */
async function addCompanyLog(req, res) {
  const companyId = parseInt(req.params.id);
  const userId = req.session.user?.id;
  const { message } = req.body;

  console.log('🧪 userId:', userId);
  console.log('🧪 req.session.user:', req.session.user);
  console.log('🧪 message:', message); // 👈 esto es lo que escribiste en el textarea

  if (!userId || !message) {
    return res.status(400).send('Datos incompletos o no autorizado');
  }

  try {
    await pool.query(
      `INSERT INTO company_logs (company_id, user_id, message, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [companyId, userId, message]
    );

    res.redirect(`/organizations/${companyId}`);
  } catch (err) {
    console.error('❌ Error al guardar el log:', err);
    res.status(500).send('Error interno al guardar el log');
  }
}






module.exports = {
  showOrganizations,
  showOrganizationDetails,
  assignAccountManager,
  addCompanyLog 
};
