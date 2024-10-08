import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import newCustomerReducer from "./slices/newCustomerSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      newCustomer: newCustomerReducer,
  
    }
  });
};
