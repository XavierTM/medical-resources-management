const { USER_TYPES } = require("../constants");


module.exports = function clerk_auth(req, res, next) {
   
   if (!req.auth)
      return res.sendStatus(401);

   if (req.auth.user.type !== USER_TYPES.CLERK)
      return res.sendStatus(403);

   next();
}