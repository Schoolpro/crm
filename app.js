/**
 * app.js
 * 
 * 📌 Archivo principal de configuración de la aplicación Express.
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const app = express(); // Inicializa Express

// 🖼️ View Engine: EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 🧱 Middlewares globales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🧠 Sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretcrm',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 🌐 Middleware para exponer `user` en todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// 🧭 Importación de rutas con verificación
function requireRoute(name, path) {
  const route = require(path);
  if (typeof route !== 'function') {
    throw new TypeError(`❌ La ruta '${name}' no exporta un router válido.`);
  }
  return route;
}

// ✅ Rutas principales
app.use('/', requireRoute('indexRouter', './routes/index'));
app.use('/', requireRoute('authRoute', './routes/authRoute'));
app.use('/users', requireRoute('userRoute', './routes/userRoute'));
app.use('/organizations', requireRoute('organizationRoute', './routes/organizationRoute'));
app.use('/search', requireRoute('searchRoute', './routes/searchRoute'));

// 🛑 404
app.use((req, res, next) => {
  next(createError(404));
});

// ⚠️ Manejador de errores
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

console.log('✅ App cargada. DB URL:', process.env.DATABASE_URL);

module.exports = app;
