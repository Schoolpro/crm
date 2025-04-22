const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.showLogin);
router.post('/login', authController.loginUser);

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.send('Error cerrando sesión');
      }
      res.redirect('/login');
    });
  });
  


module.exports = router;
