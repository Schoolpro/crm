const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')


// Ruta principal del sitio ("/")
// Cuando el usuario entra a la página raíz, se le muestra la vista "index.ejs"
// Esta vista sirve como home o dashboard inicial del CRM
router.get('/', (req, res) => {
  res.render('index')
})


// Ruta GET para mostrar los contactos y el formulario
router.get('/contacts', contactController.showContacts)

// Ruta POST para guardar un nuevo contacto
router.post('/contacts', contactController.createContact)


router.get('/', (req, res) => {
  res.redirect('/contacts')
})


module.exports = router
