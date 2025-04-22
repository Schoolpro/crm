var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

const searchRoute = require('./routes/searchRoute');
const authRoute = require('./routes/authRoute');
const indexRouter = require('./routes/index'); // ✅ antes se llamaba contactRoutes
const usersRouter = require('./routes/users');
const organizationRoute = require('./routes/organizationRoute');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretcrm',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // si vas a usar https, se pone true
}));

// ✅ Hace que 'user' esté disponible automáticamente en todas las vistas EJS
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// ✅ ORDEN CORRECTO DE LAS RUTAS
app.use('/', indexRouter);            // ← muestra landing.ejs o index.ejs según login
app.use('/', authRoute);              // ← login, logout
app.use('/organizations', organizationRoute);
app.use('/users', usersRouter);
app.use('/search', searchRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

console.log('URL de base de datos:', process.env.DATABASE_URL);

module.exports = app;
