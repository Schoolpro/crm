/**
 * utils/passport.js
 * 
 * 📌 Este archivo configura la estrategia de autenticación con Google usando Passport.js.
 * Se conecta con el sistema OAuth 2.0 de Google para permitir que los usuarios se registren
 * o inicien sesión con su cuenta de Google.
 * 
 * 🔐 Si el usuario no existe en la base de datos, se crea automáticamente con el rol "Client".
 * 
 * 📦 Este archivo se importa en app.js para inicializar Passport y mantener la sesión activa.
 */




const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../database/db');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    // Buscar si el usuario ya existe
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    // Si no existe, lo creamos
    if (!user) {
      const firstname = profile.name.givenName;
      const lastname = profile.name.familyName;
      const role = 'Client';

      await pool.query(`
        INSERT INTO users (firstname, lastname, email, role)
        VALUES ($1, $2, $3, $4)
      `, [firstname, lastname, email, role]);

      result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      user = result.rows[0];
    }

    return done(null, user);

  } catch (err) {
    console.error('Error en Google Auth:', err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
