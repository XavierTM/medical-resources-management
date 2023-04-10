import { TextField } from "@mui/material";
import formCss from "../emotionCss/form";
import { errorToast } from "../toast";


export default function InstitutionForm(props) {
   return <div className={formCss}>
      <TextField
         id="txt-institution-name"
         label="Name"
         variant="standard"
         fullWidth
         size="small"
      />
   </div>
} 


function extractData() {
   const txtName = document.getElementById('txt-institution-name');
   const name = txtName.value;

   if (!name) {
      errorToast('Please provide the institution name');
      txtName.focus();
      return null;
   }

   return [ { name },  {}];
}

export {
   extractData
}