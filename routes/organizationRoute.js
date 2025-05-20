/**
 * organizationRoute.js
 * 
 * 📁 Este archivo define todas las rutas relacionadas con organizaciones (empresas) dentro del CRM.
 * 
 * 🔄 ¿Qué hace?
 * - GET /organizations → Muestra la lista de todas las compañías registradas.
 * - GET /organizations/:id → Muestra el detalle de una compañía específica.
 * - POST /organizations/:id/assign-manager → Permite asignar o cambiar el Account Manager desde un formulario.
 * 
 * 🧠 Este archivo conecta la URL con el controlador correspondiente (organizationController.js)
 */
const { requireLogin } = require('../middleware/authmiddleware');


const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organizationController');

// ✅ Lista de todas las organizaciones
router.get('/', orgController.showOrganizations);

// ✅ Vista de detalle de una organización específica por ID (protegida)
router.get('/:id', requireLogin, orgController.showOrganizationDetails);

// 📝 Guardar un nuevo log comercial para una organización (protegida)
router.post('/:id/log', requireLogin, orgController.addCompanyLog);


// ✅ Asigna o actualiza el Account Manager para una organización
router.post('/:id/assign-manager', orgController.assignAccountManager);

module.exports = router; // ⬅️ Esta línea es fundamental para evitar errores
