import { createAsyncThunk } from "@reduxjs/toolkit";
import { USERS } from "./constants";
import { setAuthenticated, setUser, setToken, setError, setLoading, logout } from "./authSlice";
const axios = require('axios');


export const login = (payload) => {
  console.log(payload);
  
    return async (dispatch) => {
      dispatch(setLoading(true));
      try {
        const res = await axios.post(`${USERS}/login`, payload, { withCredentials: true });
        const { data } = res;
        localStorage.setItem('userId', data.id)
        localStorage.setItem('isAuthenticated', true)
        dispatch(setUser(data));
        dispatch(setToken(data.token));
        dispatch(setAuthenticated(true));
        dispatch(setError(null));
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error de red';
        dispatch(setError(errorMessage));
      } 
      finally {
        dispatch(setLoading(false));
      }
    }
}

export const updateAuthUser = (id, payload) => {
  console.log(id, payload);
  
    return async (dispatch) => {
      dispatch(setLoading(true));
      try {
        const res = await axios.put(`${USERS}/update/${id}`, payload, { withCredentials: true });
        const { data } = res;
                
        localStorage.setItem('userId', data.id)
        localStorage.setItem('isAuthenticated', true)
        dispatch(setUser(data));
        dispatch(setToken(data.token));
        dispatch(setAuthenticated(true));
        dispatch(setError(null));
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error de red';
        dispatch(setError(errorMessage));
      } 
      finally {
        dispatch(setLoading(false));
      }
    }
}

export const logoutUser = () => {
  try {
    return async (dispatch) => {
      await axios.put(`${USERS}/logout`, { withCredentials: true });
        dispatch(logout())
    }    
  } catch (error) {
    console.log(error);
    
  }
}


export const setErrorAuth = (payload) => {
  return(dispatch) => {dispatch(setError(payload))}
}

