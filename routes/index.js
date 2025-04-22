const express = require('express')
const router = express.Router()

const contactController = require('../controllers/contactController')
const { requireLogin } = require('../middlewares/authMiddleware')

// ✅ Ruta raíz "/"
// Si hay sesión, renderiza index.ejs (dashboard)
// Si NO hay sesión, renderiza landing.ejs (inicio público)
router.get('/', (req, res) => {
  console.log('💾 sesión actual:', req.session.user); // 👈 Agregado

  if (req.session.user) {
    return res.render('index', {
      user: req.session.user
    });
  }

  res.render('landing', {
    error: null,
    user: null
  });
});


// ✅ Contactos (ruta protegida por login)
router.get('/contacts', requireLogin, contactController.showContacts)
router.post('/contacts', requireLogin, contactController.createContact)

module.exports = router
