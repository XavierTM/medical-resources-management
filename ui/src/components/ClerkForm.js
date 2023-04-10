import Component from "@xavisoft/react-component";
import formCss from "../emotionCss/form";
import { Button, MenuItem, TextField } from "@mui/material";
import { hideLoading, showLoading } from '../loading';
import { errorToast } from '../toast';
import request from '../request';



export default class ClerkForm extends Component {

   static institutions = [];
   
   state = {
      institutions: [],
      institutionsFetched: false,
      selectedInstitution: '',
   }

   onSelectedInsitutionChange = (event) => {
      const selectedInstitution = event.target.value;
      document.getElementById('txt-institution').value = selectedInstitution;
      this.updateState({ selectedInstitution })
   }

   fetchInstitutions = async () => {
      try {

         showLoading();

         const res = await request.get('/api/institutions');
         const institutions = res.data;

         this.updateState({ institutions, institutionsFetched: true });
         ClerkForm.institutions = institutions;

      } catch (err) {

      } finally {
         hideLoading()
      }
   }

   componentDidMount() {
      this.fetchInstitutions();
   }

   render() {

      let jsx;

      if (this.state.institutions.length > 0) {
         jsx = <div className={formCss} style={{ maxWidth: 400 }}>

            <TextField
               id="txt-institution"
               label="Institution"
               variant="standard"
               fullWidth
               size="small"
               select
               value={this.state.selectedInstitution}
               onChange={this.onSelectedInsitutionChange}
            >
               {
                  this.state.institutions.map(institution => {
                     return <MenuItem value={institution.id}>{institution.name}</MenuItem>
                  })
               }
            </TextField>

            <TextField
               id="txt-name"
               label="Name"
               variant="standard"
               fullWidth
               size="small"
            />

            <TextField
               id="txt-surname"
               label="Surname"
               variant="standard"
               fullWidth
               size="small"
            />

            <TextField
               id="txt-email"
               label="Email"
               variant="standard"
               fullWidth
               size="small"
            />

            <TextField
               id="txt-password"
               label="Name"
               variant="standard"
               fullWidth
               size="small"
               type="password"
            />

         </div>
      } else {
         let message, btnCaption;

         if (this.state.institutionsFetched) {
            message = 'No institutions on the system, you need to add at least one to be able to add a clerk';
            btnCaption = 'RELOAD';
         } else {
            message = 'Failed to load institutions';
            btnCaption = 'RETRY';
         }

         jsx = <div>
            <p style={{ color: 'grey', fontSize: 24 }}>
               {message}
            </p>

            <Button onClick={this.fetchInstitutions}>
               {btnCaption}
            </Button>
         </div>
      }
      return jsx;
   }
}

function extractData() {

   const txtName = document.getElementById('txt-name');

   if (!txtName)
      return;

   
   const txtInstitution = document.getElementById('txt-institution');
   const txtSurname = document.getElementById('txt-surname');
   const txtEmail = document.getElementById('txt-email');
   const txtPassword = document.getElementById('txt-password');

   const institution = txtInstitution.value;
   const name = txtName.value;
   const surname = txtSurname.value;
   const email = txtEmail.value;
   const password = txtPassword.value;

   if (!institution) {
      errorToast('Please the select the insitution');
      txtInstitution.focus();
      return;
   }

   if (!name) {
      errorToast('Please provide the name of the clerk');
      txtName.focus();
      return;
   }

   if (!surname) {
      errorToast('Please provide the surname of the clerk');
      txtSurname.focus();
      return;
   }

   if (!email) {
      errorToast('Please provide the email of the clerk');
      txtEmail.focus();
      return;
   }

   if (!password) {
      errorToast('Please provide a password for logging in');
      txtPassword.focus();
      return;
   }

   const object = {
      institution,
      name,
      surname,
      email,
      password
   }


   const [ institutionObject ] = ClerkForm.institutions.filter(item => item.id === parseInt(institution));

   const properties = {
      institution: institutionObject || {},
   }

   return [ object, properties ]


}

export {
   extractData
}