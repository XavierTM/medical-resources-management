import { TextField } from "@mui/material";
import formCss from "../emotionCss/form";
import { errorToast } from "../toast";


export default function ResourceTypeForm(props) {
   return <div className={formCss}>
      <TextField
         id="txt-resource-type-name"
         label="Name"
         variant="standard"
         fullWidth
         size="small"
      />
   </div>
} 


function extractData() {
   const txtName = document.getElementById('txt-resource-type-name');
   const name = txtName.value;

   if (!name) {
      errorToast('Please provide the resource type name');
      txtName.focus();
      return null;
   }

   return [ { name }, {} ];
}

export {
   extractData
}