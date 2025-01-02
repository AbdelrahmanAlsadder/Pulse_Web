// Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../helpers/firebase_helper"; // Import the helper function to get the Firebase backend methods

// action imports to dispatch appropriate state updates
import {
  registerUserSuccessful, // Action dispatched on successful registration
  registerUserFailed,     // Action dispatched on failed registration
  resetRegisterFlagChange, // Action to reset the registration success/failure flags
  apiErrorChange,          // Action to handle API errors
} from "./reducer";

// initialize relevant method of Firebase authentication
const fireBaseBackend = getFirebaseBackend(); // Calls the helper function to initialize the Firebase backend methods for authentication

// User Registration Handler - dispatches actions based on the outcome of registration attempt
export const registerUser = (user: any) => async (dispatch: any) => {
  try {
    let response;

    
    // Make a call to the Firebase backend to register the user with email and password
    response = await fireBaseBackend.registerUser(user.email, user.password);
   
    if (response) {
      // If the registration is successful, add the new user details to Firestore
      await fireBaseBackend.addNewUserToFirestore(user);
    
    }
  } catch (error) {
    // If an error occurs, dispatch the registerUserFailed action to handle the error
    dispatch(registerUserFailed(error));
  }
};

// Reset the registration flags (success or failure)
export const resetRegisterFlag = () => {
  try {
    const response = resetRegisterFlagChange(); // Dispatch an action to reset registration flags
    return response; // Return the response (state update)
  } catch (error) {
    // If an error occurs during reset, return the error
    return error;
  }
};

// Handle API errors by dispatching an appropriate action to update the state
export const apiError = () => {
  try {
    const response = apiErrorChange(""); // Dispatch an action to handle API errors (clearing the error message)
    return response; // Return the response (state update)
  } catch (error) {
    // If an error occurs during API error handling, return the error
    return error;
  }
};
