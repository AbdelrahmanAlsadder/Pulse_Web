//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../helpers/firebase_helper";

// action
import {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange,
} from "./reducer";

// initialize relavant method of both Auth
const fireBaseBackend = getFirebaseBackend();

// Is user register successfull then direct plot user in redux.
export const registerUser = (user: any) => async (dispatch: any) => {
  try {
    let response;


      console.log("0");
      response = await fireBaseBackend.registerUser(user.email, user.password);
      console.log("1");
      if (response) await fireBaseBackend.addNewUserToFirestore(user);
      console.log("2");

  } catch (error) {
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
