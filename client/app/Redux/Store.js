"use client";
import { configureStore, createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("meshverse-user"));
const speckle_auth_token = JSON.parse(
  localStorage.getItem("meshverse-speckle-auth-token")
);

const initialState = {
  user: user !== null ? user : null,
  speckle_auth_token: speckle_auth_token !== null ? speckle_auth_token : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setSpeckleAuthToken: (state, action) => {
      state.speckle_auth_token = action.payload.speckle_auth_token;
    },
  },
});

export const {
  setTest,
  setUser,
  setSpeckleAuthToken,
  setSpeckleStreamName,
  setSpeckleStreamID,
} = authSlice.actions;
export default authSlice.reducer;
