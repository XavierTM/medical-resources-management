import Page from "./Page";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Divider, } from "@mui/material";
import SideMenu from "../components/SideMenu";
import ItemManager from "../components/ItemManager";
import actions from "../actions";
import ResourceForm, { extractData as extractResourceFormData } from "../components/ResourceForm";
import Resources from "../components/Resources";
import BookingForm from "../components/BookingForm";
import Bookings from "../components/Bookings";
import { connect } from "react-redux";
import HospitalIcon from '@mui/icons-material/LocalHospital';


const menuItems = [
   { value: 'resources',  caption: 'Resources' },
   { value: 'bookings',  caption: 'Bookings' },
]


class ClerkDashboard extends Page {

   state = {
      currentMenuItem: 'resources',
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
      let editor;

      switch (this.state.currentMenuItem) {

         case 'resources':
            formRenderer = ResourceForm;
            listRenderer = Resources;
            itemGroupName = 'resources';
            extractFormData = extractResourceFormData;
            screenName = 'Resources';
            itemName = 'resource';
            break;

         case 'bookings':
            formRenderer = BookingForm;
            listRenderer = Bookings;
            itemGroupName = 'bookings';
            screenName = 'Bookings';
            editor = BookingForm
            break;
      
         default:
            break;
      }

      let headerJSX;

      if (this.props.userInfo && this.props.userInfo.institution) {

         const { name } = this.props.userInfo.institution;

         headerJSX = <h1 className="v-align">
            <HospitalIcon style={{ margin: 'auto 10px' }} />
            {name}
         </h1>
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
            header={headerJSX}
         /> 

         <div>

            <div className="v-align">
               <h1 style={{ marginLeft: 20 }}>Clerk Dashboard</h1>
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
               editor={editor}
            />

         </div>

      </div>
   }
}


function mapStateToProps(state) {
   const { userInfo } = state;
   return { userInfo }
}


export default connect(mapStateToProps)(ClerkDashboard);