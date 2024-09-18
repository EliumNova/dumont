// src/app/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  principales: null,
  ubicacion: null,
  horus: null,
};

const newCustomerSlice = createSlice({
  name: "newCustomer",
  initialState,
  reducers: {
    setPrincipales(state, action) {
      state.principales = action.payload;
    },
    setUbicacion(state, action) {
      state.ubicacion = action.payload;
    },
    setHorus(state, action) {
      state.horus = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    cancel(state) {
      state.Email = null;
      state.Name = null;
      state.DNI = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setPrincipales,
  setUbicacion,
  setHorus,
  cancel,
} = newCustomerSlice.actions;
export default newCustomerSlice.reducer;
