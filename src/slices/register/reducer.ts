//Purpose of the slice: This slice is dedicated to managing the registration flow. 
// It tracks whether the registration is in progress (loading), 
// whether it was successful (success), and handles error states
//(registrationError, error). It also manages the user data once registration is completed.

//Reducers: Each reducer is responsible for updating specific pieces of state.
//For example, registerUserSuccessful is used when registration is successful,
//whereas registerUserFailed handles errors. resetRegisterFlagChange resets flags,
//and apiErrorChange handles errors from API calls.


import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  registrationError: null,
  message: null,
  loading: false,
  user: null,
  success: false,
  error: false,
  isUserLogout: true
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerUserSuccessful(state, action) {
      state.user = action.payload.user;
      state.loading = false;
      state.success = true;
      state.registrationError = null;
    },
    registerUserFailed(state, action) {
      state.user = null;
      state.loading = false;
      state.registrationError = action.payload;
      state.error = true;
    },
    resetRegisterFlagChange(state) {
      state.success = false;
      state.error = false;
    },
    apiErrorChange(state, action){
      state.error = action.payload;
      state.loading = false;
      state.isUserLogout = false;
    }
  }
});

export const {
  registerUserSuccessful,
  registerUserFailed,
  resetRegisterFlagChange,
  apiErrorChange
} = registerSlice.actions;

export default registerSlice.reducer;