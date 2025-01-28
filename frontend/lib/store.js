import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import newCustomerReducer from "./slices/newCustomerSlice";
import userSlice from './slices/users/userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      newCustomer: newCustomerReducer,
      users: userSlice,
  
    }
  });
};
