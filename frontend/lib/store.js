import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import newCustomerReducer from './slices/newCustomerSlice';
import userSlice from './slices/users/userSlice';
import clientSlice from './slices/clients/clientSlice'; // Importa el reducer de clientes

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      newCustomer: newCustomerReducer,
      users: userSlice,
      clients: clientSlice, // Agrega el reducer de clientes
    },
  });
};
