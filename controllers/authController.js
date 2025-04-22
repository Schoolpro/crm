const bcrypt = require('bcryptjs');
const pool = require('../database/db');

// ✅ Ya no pasamos `user` en el render, porque lo maneja res.locals.user desde app.js
async function showLogin(req, res) {
  res.render('login', {
    error: null
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.render('login', {
        error: 'Usuario no encontrado.'
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.render('login', {
        error: 'Contraseña incorrecta.'
      });
    }

    // ✅ Guardamos el usuario en sesión
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      company_id: user.company_id
    };

    res.redirect('/') // ✅ Esto redirige al dashboard (index.ejs)
 
  } catch (err) {
    console.error('Error en login:', err);
    res.render('login', {
      error: 'Error interno.'
    });
  }
}

module.exports = {
  showLogin,
  loginUser
};
