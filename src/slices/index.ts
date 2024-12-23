import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

//Invoice


//authantication
import LoginReducer from "./login/reducer";
import AccountReducer from "./register/reducer";




const rootReducer = combineReducers ({
    Layout: LayoutReducer,
   
    Login: LoginReducer,
    Account: AccountReducer,


})


export default rootReducer