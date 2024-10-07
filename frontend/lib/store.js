import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
<<<<<<< HEAD
=======
import newCustomerReducer from "./slices/newCustomerSlice";
>>>>>>> main

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
<<<<<<< HEAD
=======
      newCustomer: newCustomerReducer,
>>>>>>> main
  
    }
  });
};
