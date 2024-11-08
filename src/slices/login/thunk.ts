//Include Both Helper File with needed methods

import { getFirebaseBackend } from "../../helpers/firebase_helper";
import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
} from "./reducer";
import { postFakeLogin, postJwtLogin } from "../../helpers/fakebackend_helper";

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
  try {
    let response: any;

    let fireBaseBackend = getFirebaseBackend();
    response = await fireBaseBackend.loginUser(user.email, user.password);

    var data = await response;

    if (data) {
      console.log("data :>> ", data.uid);
      var user_details = await fireBaseBackend.getUserDetailsByUid(data.uid);
      if (user_details) {
        if (user_details.status == -1) {
          // disabled
          console.log("disabled");
        } else if (user_details.status == 0) {
          // waiting for approval
          console.log("waiting for approval");
        } else {
          dispatch(loginSuccess(user_details));
          history("/dashboard");
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
