
import { ACTIONS } from "./constants";
import store from "./store";



function setCurrentRoute(route) {

   const action = {
      type: ACTIONS.SET_CURRENT_ROUTE,
      payload:  { route }
   }

   store.dispatch(action);

}

function setItems(items) {

   const action = {
      type: ACTIONS.SET_ITEMS,
      payload:  items,
   }

   store.dispatch(action);

}

function addItem(item) {

   const action = {
      type: ACTIONS.ADD_ITEM,
      payload:  item,
   }

   store.dispatch(action);

}

function deleteItem(id) {

   const action = {
      type: ACTIONS.DELETE_ITEM,
      payload:  { id },
   }

   store.dispatch(action);

}

function setUserInfo(userInfo) {

   const action = {
      type: ACTIONS.SET_USER_INFO,
      payload:  userInfo,
   }

   store.dispatch(action);

}


const actions = {
   addItem,
   deleteItem,
   setCurrentRoute,
   setItems,
   setUserInfo,
}


export default actions;