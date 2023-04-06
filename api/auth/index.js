

const { init: initAuth } = require('@xavisoft/auth/backend');
const authenticator = require('./authenticator');

async function init(app) {

   const SECRET_KEY = process.env.JWT_SECRET;
   const ACCESS_TOKEN_VALIDITY_PERIOD = 60 * 60 * 1000;
   const DB_PATH = __dirname;

   await initAuth({
      app,
      authenticator,
		ACCESS_TOKEN_VALIDITY_PERIOD,
		DB_PATH,
		SECRET_KEY,
   })
}

module.exports = {
   init,
}

