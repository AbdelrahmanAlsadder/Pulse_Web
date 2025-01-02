//Include Both Helper File with needed methods


//The main purpose of this code is to manage the user authentication flow (login, logout, social login) and update the state accordingly using Redux actions.
// Login Flow: The loginUser function handles different user statuses, displays appropriate notifications, and redirects users based on their role (admin, warehouse, pharmacy).
// Social Login: The socialLogin function allows users to log in using social media accounts (e.g., Google, Facebook) via Firebase.
// Logout: The logoutUser function logs the user out by removing authentication data from local storage and dispatching the relevant action.
// Error Handling: Every function includes error handling where any failure is caught, and an error message is dispatched via the apiError action.
// Notifications: The toast notifications provide real-time feedback to users during the login and logout process.


import { getFirebaseBackend } from "../../helpers/firebase_helper";
import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
} from "./reducer";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
  try {
    let response: any;

    let fireBaseBackend = getFirebaseBackend();
    response = await fireBaseBackend.loginUser(user.email, user.password);

    var data = await response;

    if (data) {
      
      var user_details = await fireBaseBackend.getUserDetailsByUid(data.uid);
      if (user_details) {
        if (user_details.status == -1) {
          // disabled
          toast.error("Sorry, But Your Account is Disabled", { autoClose: 2000 });
          
        } else if (user_details.status == 0) {
          // waiting for approval
          toast.info("Please Wait, Your Account is Under Approval", { autoClose: 2000 });
         
        } else if (user_details.status == 1){//admin user go to the user page
          dispatch(loginSuccess(user_details));
          history("/user");
        }
        else if (user_details.status == 2){//warehouse user go to dashboard
          dispatch(loginSuccess(user_details));
          history("/dashboard");
        }
        else if (user_details.status == 3){//pharmacy user, he shouldn't be here
          toast.error("This Page is Only for Warehouse,\nPlease Download our App", { autoClose: 2000 });
        
        }
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    localStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin =
  (type: any, history: any) => async (dispatch: any) => {
    try {
      let response;

      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const fireBaseBackend = getFirebaseBackend();
        response = fireBaseBackend.socialLoginUser(type);
      }
      //  else {
      //   response = postSocialLogin(data);
      // }

      const socialdata = await response;
      if (socialdata) {
        localStorage.setItem("authUser", JSON.stringify(socialdata));
        dispatch(loginSuccess(socialdata));
        history("/dashboard");
      }
    } catch (error) {
      dispatch(apiError(error));
    }
  };

export const resetLoginFlag = () => async (dispatch: any) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
