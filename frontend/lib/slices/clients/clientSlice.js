import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Estado para el formulario de nuevo cliente
  newCustomer: {
    principales: {}, // Información básica del cliente
    ubicacion: {}, // Ubicación del cliente
    horus: {}, // Horarios del cliente
    loading: false, // Estado de carga
    error: null, // Mensaje de error
  },
  // Estado para la lista de clientes y operaciones CRUD
  allClients: {
    rows: [],
    count: 0,
  }, // Lista de todos los clientes
  newClient: {}, // Cliente recién creado
  updatedClient: {}, // Cliente actualizado
  deletedClient: {}, // Cliente eliminado
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    // Acciones para el formulario de nuevo cliente
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

    // Acciones para la lista de clientes y operaciones CRUD
    setClients: (state, { payload }) => {
      console.log('Setting clients in state:', payload);
      state.allClients = payload;
    },
    addClient: (state, { payload }) => {
      state.newClient = payload;
      state.allClients.push(payload);
    },
    updateClient: (state, { payload }) => {
      state.updatedClient = payload;
      state.allClients = state.allClients.map((client) =>
        client.idClientes === payload.idClientes ? payload : client
      );
    },
    removeClient: (state, { payload }) => {
      state.deletedClient = payload;
      state.allClients = state.allClients.filter(
        (client) => client.idClientes !== payload
      );
    },
  },
});

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
