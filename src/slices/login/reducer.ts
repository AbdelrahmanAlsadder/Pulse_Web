//This slice centralizes the logic for managing user authentication state, such as login success, login error, user logout, and resetting flags

//Reducers and Thunks in Redux
//Redux is a state management library used in JavaScript applications,
//  typically in combination with React. It uses actions and reducers
//  to manage the state of an application. To understand reducers and thunks, let’s break down their roles:

//Reducers
//A reducer is a function that specifies how the application's
//  state changes in response to an action. It is a core concept in Redux,
//  as it updates the state based on the type of action that is dispatched.

//Thunks
//A thunk is a concept in Redux for handling asynchronous actions 
// (e.g., fetching data from an API, delaying actions, etc.). In Redux, 
// actions are typically synchronous. However, you might want to perform an asynchronous
//  task before dispatching an action, such as fetching data or waiting for a response.
//  Thunks provide a way to handle that.


import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of the login slice. 
// It contains properties related to the user login status and any errors encountered during the login process.
export const initialState = {
  user: {}, // Holds user data (empty initially)
  error: "", // Stores error message if login fails
  loading: false, // Tracks if a login request is in progress
  isUserLogout: false, // Indicates if the user has logged out successfully
  errorMsg: false, // A flag to indicate if an error message should be shown
};

const loginSlice = createSlice({
  // The slice is named "login" and will manage the state related to user authentication.
  name: "login",
  initialState, // The initial state defined above
  reducers: {
    // The reducer functions handle different actions related to login.

    // Handles an API error (e.g., invalid credentials).
    // It updates the error state and sets loading to true to indicate an ongoing process.
    apiError(state, action) {
      state.error = action.payload.data; // Set the error message from the payload
      state.loading = true; // Indicates that an API request is in progress
      state.isUserLogout = false; // Make sure the logout state is false if an error occurs
      state.errorMsg = true; // Display the error message
    },

    // Handles a successful login.
    // It updates the user state with the payload (user data) and sets loading to false.
    loginSuccess(state, action) {
      state.user = action.payload; // Update the user state with the logged-in user's data
      state.loading = false; // Stop the loading state once the login is successful
      state.errorMsg = false; // Reset the error message flag
    },

    // Handles a successful user logout.
    // It sets `isUserLogout` to true, indicating that the user has logged out successfully.
    logoutUserSuccess(state, action) {
      state.isUserLogout = true; // Set the logout flag to true after a successful logout
    },

    // Resets the login-related flags to their initial states.
    // This is useful for clearing error messages, stopping loading indicators, and resetting the error flag.
    reset_login_flag(state) {
      state.error = ""; // Clear any error message
      state.loading = false; // Stop the loading state
      state.errorMsg = false; // Hide the error message
    }
  },
});

// Export the action creators that will be used to dispatch actions to update the state
export const {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  reset_login_flag
} = loginSlice.actions;

// Export the reducer function to be used in the store configuration
export default loginSlice.reducer;
