const { USER_TYPES } = require("../constants");


module.exports = function admin_auth(req, res, next) {
   
   if (!req.auth)
      return res.sendStatus(401);

   // by the way, this introduces a security vulnerability
   if (req.method.toLowerCase() === 'get')
      return next();

   if (req.auth.user.type !== USER_TYPES.ADMIN)
      return res.sendStatus(403);

   next();
}