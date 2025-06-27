// newCustomerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const newCustomerSlice = createSlice({
  name: 'newCustomer',
  initialState: {
    principales: {},
    ubicacion: {},
    horus: {},
  },
  reducers: {
    setPrincipales: (state, action) => {
      state.principales = action.payload;
    },
    setUbicacion: (state, action) => {
      state.ubicacion = action.payload;
    },
    setHorus: (state, action) => {
      state.horus = action.payload;
    },
  },
});

export const { setPrincipales, setUbicacion, setHorus } =
  newCustomerSlice.actions;
export default newCustomerSlice.reducer;
