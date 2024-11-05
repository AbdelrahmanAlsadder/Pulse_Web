//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import {
  postFakeRegister,
  postJwtRegister,
} from "../../helpers/fakebackend_helper";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange,
} from "./reducer";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../App";

// initialize relavant method of both Auth
const fireBaseBackend = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
export const registerUser = (user: any) => async (dispatch: any) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      // Create user with Firebase Authentication
      response = await fireBaseBackend.registerUser(user.email, user.password);
      
      // Store additional data in Firestore
      const userId = response.user.uid;
      const userDocRef = doc(db, "users", userId); // Reference to the user document

      // Log the user data to verify its correctness
      console.log('User data to be stored:', {
        username: user.username,
        phone: user.phone,
        CommercialRegister: user.CommercialRegister,
        isConfirmed: false,
      });

      // Use await to ensure setDoc completes
      await setDoc(userDocRef, {
        username: user.username,
        phone: user.phone,
        CommercialRegister: user.CommercialRegister,
        isConfirmed: false, // set isConfirmed to false by default
      });

      // Dispatch success action
      dispatch(registerUserSuccessful(response));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = await postJwtRegister("/post-jwt-register", user);
      dispatch(registerUserSuccessful(response.data));
    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      response = await postFakeRegister(user);
      const data: any = await response;
      if (data.message === "success") {
        dispatch(registerUserSuccessful(data));
      } else {
        dispatch(registerUserFailed(data));
      }
    }
  } catch (error) {
    console.error('Error during registration or Firestore operation:', error);
    dispatch(registerUserFailed(error));
  }
};

export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange();
    return response;
  } catch (error) {
    return error;
  }
};

export const apiError = () => {
  try {
    const response = apiErrorChange("");
    return response;
  } catch (error) {
    return error;
  }
};
