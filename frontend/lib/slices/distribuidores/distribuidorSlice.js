import { createSlice } from "@reduxjs/toolkit";

export const DistribuidorSlice = createSlice({
  name: "distribuidores",
  initialState: {
    allDistribuidores: {
      rows: [],
      count: 0,
    },
  },
  reducers: {
    /* CARGAR LISTA */
    allDistribuidores: (state, { payload }) => {
      state.allDistribuidores = payload;
    },

    /* CREAR */
    newDistribuidor: (state, { payload }) => {
      state.allDistribuidores.rows.unshift(payload);
      state.allDistribuidores.count += 1;
    },

    /* 🔥 UPDATE EN TIEMPO REAL */
    updateDistribuidor: (state, { payload }) => {
      state.allDistribuidores.rows = state.allDistribuidores.rows.map((dist) =>
        dist.idDistribuidor === payload.idDistribuidor ||
        dist.idDistribuidor === payload.id
          ? { ...dist, ...payload }
          : dist
      );
    },

    /* 🔥 DELETE EN TIEMPO REAL */
    deleteDistribuidor: (state, { payload }) => {
      state.allDistribuidores.rows = state.allDistribuidores.rows.filter(
        (dist) => dist.idDistribuidor !== payload
      );
      state.allDistribuidores.count -= 1;
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
