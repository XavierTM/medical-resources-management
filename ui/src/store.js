
import reducer from "./reducer";
import { createStore } from 'redux';


const initialState = {
   currentRoute: '/',
   items: [],
   userInfo: null
}

const store = createStore(
   reducer,
   initialState
);

export default store;