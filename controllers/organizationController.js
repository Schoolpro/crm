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

async function showOrganizationDetails(req, res, next) {
  try {
    const organizationId = req.params.id;
    const organizationData = await orgModel.getOrganizationById(organizationId);

    console.log('ID solicitado:', organizationId);
    console.log('Resultado del modelo:', organizationData);

    // Si no encontró la organización, pasar null
    if (!organizationData) {
      return res.render('organization-details', { organization: null });
    }

    res.render('organization-details', { organization: organizationData });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  showOrganizations,
  showOrganizationDetails
};
