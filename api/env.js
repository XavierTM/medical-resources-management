


function presenceChecker(keys=[]) {
   keys.forEach(key => {

      if (!process.env[key]) {
         throw new Error(`Environment variable '${key}' is essential`);
      }
   });
}

const BASE_KEYS = [
   'PORT',
   'NODE_ENV',
   'JWT_SECRET',
   'ADMIN_EMAIL',
   'ADMIN_PASSWORD',
   'PASSWORD_SALT_ROUNDS',
];



const CONDITIONAL_KEYS = [];

// conditional logic

presenceChecker(CONDITIONAL_KEYS);
presenceChecker(BASE_KEYS);
