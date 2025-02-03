import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allClients: [],
  newClient: {},
  updatedClient: {},
  deletedClient: {},
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
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

export const { setClients, addClient, updateClient, removeClient } =
  clientSlice.actions;

export default clientSlice.reducer;
