import Page from "./Page";
import { Button, TextField } from '@mui/material';
import { css } from '@emotion/css';
import { errorToast } from '../toast';
import { hideLoading, showLoading } from '../loading';
import request from '../request';
import swal from 'sweetalert';
import { getAuthToken } from '@xavisoft/auth/frontend/utils';
import { decodeJWT } from "../utils";
import actions from "../actions";




const divLoginStyle = css({ 
   maxWidth: 400, 
   minWidth: 200,
   margin: 10,
   '& > *': {
      margin: '10px auto'
   },
   '& a': {
      display: 'inline-block',
      marginLeft: 5,
      textDecoration: 'none',
   }
});

class Login extends Page {


  

   login = async () => {

      // check
      const txtEmail = document.getElementById('txt-email');
      const txtPassword = document.getElementById('txt-password');

      const email = txtEmail.value;
      const password = txtPassword.value;

      if (!email) {
         errorToast('Email is required');
         return txtEmail.focus();
      }

      if (!password) {
         errorToast('Password is required');
         return txtPassword.focus();
      }

      const credentials = { email, password };

      try {

         showLoading();
         await request.post('/api/login', credentials);
         const authToken = getAuthToken();
         const userInfo = decodeJWT(authToken);

         let route;

         if (userInfo.user.type === 'admin')
            route = '/admin-dashboard';
         else
            route = '/clerk-dashboard';

         actions.setItems([]);
         actions.setUserInfo(userInfo.user);
         window.App.redirect(route);


      } catch (err) {
         swal(String(err));
      } finally {
         hideLoading()
      }

      
   }

   _render() {
      
      return <div className="fill-container vh-align">
         <div className={divLoginStyle}>
            <h2 className="halign">Login</h2>

            <TextField
               fullWidth
               label="Email"
               id="txt-email"
               variant="standard"
               size="small"
            />

            <TextField
               fullWidth
               label="Password"
               id="txt-password"
               variant="standard"
               size="small"
               type="password"
            />

            <div style={{
               display: 'grid',
               gridTemplateColumns: '1fr',
               columnGap: 20
            }}>
               <div>
                  <Button fullWidth variant="contained" onClick={this.login}>
                     LOGIN
                  </Button>
               </div>

            </div>
         </div>
      </div>
   }
}

export default Login;