

function delay(millis) {
   return new Promise(resolve => {
      setTimeout(resolve, millis);
   })
}

function formatTimeForDisplay(date) {
   date = new Date(date);
   return date.toLocaleString();
}

function decodeJWT(token) {
   var base64Url = token.split('.')[1];
   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));

   return JSON.parse(jsonPayload);
}

export {
   decodeJWT,
   delay,
   formatTimeForDisplay,
}