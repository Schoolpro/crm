function requireLogin(req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    next();
  }
  
  function requireSuperadmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'superadmin') {
      return res.status(403).send('Acceso no autorizado');
    }
    next();
  }
  
  module.exports = { requireLogin, requireSuperadmin };
  