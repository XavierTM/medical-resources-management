import { ACTIONS } from "./constants";

function setCurrentRouteReducer(state, payload) {
   const { route:currentRoute } = payload;
   return { ...state, currentRoute };
}

function setItemsReducer(state, items) {
   return { ...state, items };
}

function deleteItemReducer(state, id) {
   const items = state.items.filter(item => item.id !== id);
   return { ...state, items };
}

function addItemReducer(state, item) {
   const items = [ ...state.items, item ];
   return { ...state, items };
}

function setUserInfoReducer(state, userInfo) {
   return { ...state, userInfo };
}





function reducer(state, action) {

   const { type, payload } = action;

   switch (type) {

      case ACTIONS.SET_CURRENT_ROUTE:
         return setCurrentRouteReducer(state, payload);

      case ACTIONS.SET_ITEMS:
         return setItemsReducer(state, payload);

      case ACTIONS.ADD_ITEM:
         return addItemReducer(state, payload);

      case ACTIONS.DELETE_ITEM:
         return deleteItemReducer(state, payload.id);

      case ACTIONS.SET_USER_INFO:
         return setUserInfoReducer(state, payload);

      default:
         console.info('Invalid action type:', type);
         return state;
   }
}


export default reducer;