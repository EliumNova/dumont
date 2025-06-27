import { createSlice } from '@reduxjs/toolkit';

export const DistribuidorSlice = createSlice({
  name: 'distribuidores',
  initialState: {
    allDistribuidores: [],
    newDistribuidor: {},
    updateDistribuidor: {},
    deleteDistribuidor: {},
  },
  reducers: {
    newDistribuidor: (state, { payload }) => {
      state.newDistribuidor = payload;
    },
    allDistribuidores: (state, action) => {
      state.allDistribuidores = action.payload || [];
    },
    updateDistribuidor: (state, { payload }) => {
      state.updateDistribuidor = payload;
    },
    deleteDistribuidor: (state, { payload }) => {
      state.deleteDistribuidor = payload;
    },
  },
});

export const {
  allDistribuidores,
  newDistribuidor,
  updateDistribuidor,
  deleteDistribuidor,
} = DistribuidorSlice.actions;

export default DistribuidorSlice.reducer;
