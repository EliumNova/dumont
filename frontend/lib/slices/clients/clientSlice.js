import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // -----------------------------
  // 📌 Estado para el formulario
  // -----------------------------
  newCustomer: {
    principales: {},
    ubicacion: {},
    horus: {},
    loading: false,
    error: null,
  },

  // -----------------------------
  // 📌 Estado para la lista CRUD
  // -----------------------------
  data: {
    rows: [],
    count: 0,
  },

  newClient: null,
  updatedClient: null,
  deletedClient: null,
};

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    // ================================================================
    // -------------------- FORMULARIO DE NUEVO CLIENTE ----------------
    // ================================================================

    setPrincipales: (state, { payload }) => {
      state.newCustomer.principales = payload;
    },

    setUbicacion: (state, { payload }) => {
      state.newCustomer.ubicacion = payload;
    },

    setHorus: (state, { payload }) => {
      state.newCustomer.horus = payload;
    },

    setLoading: (state, { payload }) => {
      state.newCustomer.loading = payload;
    },

    setError: (state, { payload }) => {
      state.newCustomer.error = payload;
    },

    // ================================================================
    // ------------------------------- CRUD ----------------------------
    // ================================================================

    setClients: (state, { payload }) => {
      // payload = { rows: [...], count: number }
      state.data = {
        rows: payload.rows || [],
        count: payload.count || 0,
      };
    },

    addClient: (state, { payload }) => {
      state.newClient = payload;
      state.data.rows.push(payload);
      state.data.count += 1;
    },

    updateClient: (state, { payload }) => {
      state.updatedClient = payload;
      state.data.rows = state.data.rows.map((c) =>
        c.idClientes === payload.idClientes ? payload : c
      );
    },

    removeClient: (state, { payload }) => {
      state.deletedClient = payload;
      state.data.rows = state.data.rows.filter((c) => c.idClientes !== payload);
      state.data.count -= 1;
    },
  },
});

// Exportar acciones
export const {
  setPrincipales,
  setUbicacion,
  setHorus,
  setLoading,
  setError,
  setClients,
  addClient,
  updateClient,
  removeClient,
} = clientSlice.actions;

export default clientSlice.reducer;
