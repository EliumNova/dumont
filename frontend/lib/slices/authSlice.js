// src/app/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { updateAuthUser } from "./authAction";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      
      state.user = action.payload;      
    },
    setToken(state, action) {
      
      state.token = action.payload;
    },
    setAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.Email = null;
      state.Name = null;
      state.DNI = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    extraReducers: (builder) => {
      builder
        .addCase(updateAuthUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateAuthUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(updateAuthUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  },
});



export const {
  setUser,
  // setName,
  // setDNI,
  // setEmail,
  setToken,
  setAuthenticated,
  setLoading,
  setError,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
