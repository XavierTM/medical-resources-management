import Page from "./Page";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Divider, } from "@mui/material";
import SideMenu from "../components/SideMenu";
import ItemManager from "../components/ItemManager";
import InstitutionForm, { extractData as extractInstitutionFormdata } from "../components/InstitutionForm";
import Institutions from "../components/Institutions";
import ClerkForm, { extractData as extractClerkFormData } from "../components/ClerkForm";
import Clerks from "../components/Clerks";
import actions from "../actions";
import ResourceTypeForm, { extractData as extractResourceTypeFormData} from "../components/ResourceTypeForm";
import ResourceTypes from "../components/ResourceTypes";


const menuItems = [
   { value: 'institutions',  caption: 'Institutions' },
   { value: 'clerks',  caption: 'Clerks' },
   { value: 'res_types',  caption: 'Resource Types' },
]


class AdminDashboard extends Page {

   state = {
      currentMenuItem: 'institutions',
   }

   onSideMenuItemChange = (currentMenuItem) => {

      if (currentMenuItem === this.state.currentMenuItem)
         return;

      actions.setItems([]);
      return this.updateState({ currentMenuItem });
   }

   componentDidMount() {
      super.componentDidMount();

      // some other stuff
   }

   _render() {

      let formRenderer, listRenderer, itemGroupName, extractFormData, screenName, itemName;

      switch (this.state.currentMenuItem) {
         case 'institutions':
            formRenderer = InstitutionForm;
            listRenderer = Institutions;
            itemGroupName = 'institutions';
            extractFormData = extractInstitutionFormdata;
            screenName = 'Institutions';
            itemName = 'institution';
            break;

         case 'clerks':
            formRenderer = ClerkForm;
            listRenderer = Clerks;
            itemGroupName = 'clerks';
            extractFormData = extractClerkFormData;
            screenName = 'Clerks';
            itemName = 'clerk';
            break;

         case 'res_types':
            formRenderer = ResourceTypeForm;
            listRenderer = ResourceTypes;
            itemGroupName = 'resource-types';
            extractFormData = extractResourceTypeFormData;
            screenName = 'Resource Types';
            itemName = 'resource type';
            break;
      
         default:
            break;
      }
      
      return <div 
         style={{ 
            display: 'grid',
            gridTemplateColumns: '300px auto'
         }}
         className="fill-container"
      >
         
         <SideMenu
            items={menuItems}
            onChange={this.onSideMenuItemChange}
            current={this.state.currentMenuItem}
         /> 

         <div>
            <div className="v-align">
               <h1 style={{ marginLeft: 20 }}>Admin Dashboard</h1>
               <ChevronRightIcon style={{ margin: 10, fontSize: 30 }} color="primary" />
               <h1 className="grey-text">{screenName}</h1>
            </div>

            <Divider />

            <ItemManager
               formRenderer={formRenderer}
               listRenderer={listRenderer}
               itemGroupName={itemGroupName}
               extractFormData={extractFormData}
               items={this.props.items}
               itemName={itemName}
            />
         </div>

      </div>
   }
}


export default AdminDashboard;