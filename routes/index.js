const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')

// Ruta GET para mostrar los contactos y el formulario
router.get('/contacts', contactController.showContacts)

// Ruta POST para guardar un nuevo contacto
router.post('/contacts', contactController.createContact)


router.get('/', (req, res) => {
  res.redirect('/contacts')
})


module.exports = router
