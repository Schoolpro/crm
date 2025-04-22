const orgModel = require('../models/organizationModel');

async function showOrganizations(req, res) {
  try {
    const organizations = await orgModel.getAllOrganizations();
    res.render('organizations', { organizations });
  } catch (err) {
    console.error('Error cargando organizaciones:', err);
    res.status(500).send('Error al cargar organizaciones');
  }
}

async function showOrganizationDetails(req, res) {
  const id = req.params.id;

  try {
    const org = await orgModel.getOrganizationById(id);
    const contacts = await orgModel.getContactsByCompanyId(id);
    const logs = await orgModel.getLogsByCompanyId(id);

    res.render('organization-details', { org, contacts, logs });
  } catch (err) {
    console.error('Error mostrando detalles de la empresa:', err);
    res.status(500).send('Error al cargar detalles');
  }
}

module.exports = {
  showOrganizations,
  showOrganizationDetails
};
