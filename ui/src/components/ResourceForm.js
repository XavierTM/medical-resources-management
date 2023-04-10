import Component from "@xavisoft/react-component";
import formCss from "../emotionCss/form";
import { Button, MenuItem, TextField } from "@mui/material";
import { hideLoading, showLoading } from '../loading';
import { errorToast } from '../toast';
import request from '../request';

export default class ResourceForm extends Component {

   static resourceTypes = []
   
   state = {
      resourceTypes: [],
      resourceTypesFetched: false,
      selectedResourceType: '',
   }

   oneSelectedResourceTypeChange = (event) => {
      const selectedResourceType = event.target.value;
      document.getElementById('txt-resource-type').value = selectedResourceType;
      this.updateState({ selectedResourceType})
   }

   fetchInstitutions = async () => {
      try {

         showLoading();

         const res = await request.get('/api/resource-types');
         const resourceTypes = res.data;

         this.updateState({ resourceTypes, resourceTypesFetched: true });
         ResourceForm.resourceTypes = resourceTypes;

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

      if (this.state.resourceTypes.length > 0) {
         jsx = <div className={formCss} style={{ maxWidth: 400 }}>

            <TextField
               id="txt-resource-type"
               label="Resource type"
               variant="standard"
               fullWidth
               size="small"
               select
               value={this.state.selectedResourceType}
               onChange={this.oneSelectedResourceTypeChange}
            >
               {
                  this.state.resourceTypes.map(resourceType => {
                     return <MenuItem value={resourceType.id}>{resourceType.name}</MenuItem>
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

         </div>
      } else {
         let message, btnCaption;

         if (this.state.resourceTypesFetched) {
            message = 'No resource types on the system, you need to add at least one to be able to add a resource';
            btnCaption = 'RELOAD';
         } else {
            message = 'Failed to load resource types';
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

   const txtResourceType = document.getElementById('txt-resource-type');

   const resource_type = txtResourceType.value;
   const name = txtName.value;

   if (!resource_type) {
      errorToast('Please the select the resource type');
      txtResourceType.focus();
      return;
   }

   if (!name) {
      errorToast('Please provide the name of the resource');
      txtName.focus();
      return;
   }

   const object = {
      resource_type,
      name,
   }

   const [ resourceType ] = ResourceForm.resourceTypes.filter(item => item.id === parseInt(resource_type));

   const properties = {
      resource_type: resourceType
   };

   return [ object, properties ]


}

export {
   extractData
}