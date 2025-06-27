import { createSlice } from '@reduxjs/toolkit';

const dispositivoSlice = createSlice({
  name: 'dispositivos',
  initialState: {
    allDispositivos: [], // Asegúrate de que esta propiedad esté definida aquí
  },
  reducers: {
    allDispositivos: (state, action) => {
      state.allDispositivos = action.payload;
    },
    newDispositivo: (state, action) => {
      state.allDispositivos.push(action.payload);
    },
    updateDispositivo: (state, action) => {
      const index = state.allDispositivos.findIndex(
        (dispositivo) => dispositivo.id === action.payload.id
      );
      if (index !== -1) {
        state.allDispositivos[index] = action.payload;
      }
    },
    deleteDispositivo: (state, action) => {
      state.allDispositivos = state.allDispositivos.filter(
        (dispositivo) => dispositivo.id !== action.payload.id
      );
    },
  },
});

export const {
  allDispositivos,
  newDispositivo,
  updateDispositivo,
  deleteDispositivo,
} = dispositivoSlice.actions;

export default dispositivoSlice.reducer;
