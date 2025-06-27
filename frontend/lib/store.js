import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import newCustomerReducer from './slices/newCustomerSlice';
import userSlice from './slices/users/userSlice';
import clientReducer from './slices/clients/clientSlice'; // Importa el reducer de clientes
import distribuidorReducer from './slices/distribuidores/distribuidorSlice';
import dispositivoReducer from './slices/dispositivos/dispositivoSlice';
import clientesDistribuidoresReducer from './slices/dispositivos/clientesDistribuidoresSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      newCustomer: newCustomerReducer,
      users: userSlice,
      clients: clientReducer, // Agrega el reducer de clientes
      distribuidores: distribuidorReducer,
      dispositivos: dispositivoReducer,
      clientesDistribuidores: clientesDistribuidoresReducer,
    },
  });
};
