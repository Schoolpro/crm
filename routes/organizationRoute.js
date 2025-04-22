const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organizationController');

router.get('/', orgController.showOrganizations);

router.get('/:id', orgController.showOrganizationDetails);


module.exports = router;
