import { createAsyncThunk } from '@reduxjs/toolkit';
import { USERS } from './constants';
import {
  setAuthenticated,
  setUser,
  setToken,
  setError,
  setLoading,
  logout,
} from './authSlice';
import axios from 'axios';

export const fetchUserData = (userId) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${USERS}/${userId}`, {
        withCredentials: true,
      });
      const { data } = res;

      // Actualizar el estado de Redux con los datos del usuario
      dispatch(setUser(data));
    } catch (err) {
      console.error('Error al obtener los datos del usuario:', err);
      dispatch(setError('Error al obtener los datos del usuario'));
    }
  };
};

export const initializeAuth = () => {
  return (dispatch) => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (token && userId && isAuthenticated) {
      // Restaurar el estado de autenticación
      dispatch(setToken(token));
      dispatch(setAuthenticated(true));

      // Opcional: Obtener los datos del usuario desde el servidor
      dispatch(fetchUserData(userId));
    }
  };
};

export const login = (payload) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${USERS}/login`, payload, {
        withCredentials: true,
      });
      const { data } = res;

      // Almacenar el token en localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('isAuthenticated', true);

      // Actualizar el estado de Redux
      dispatch(setUser(data));
      dispatch(setToken(data.token));
      dispatch(setAuthenticated(true));
      dispatch(setError(null));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error de red';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateAuthUser = (id, payload) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.put(`${USERS}/update/${id}`, payload, {
        withCredentials: true,
      });
      const { data } = res;

      // Almacenar el token en localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('isAuthenticated', true);

      // Actualizar el estado de Redux
      dispatch(setUser(data));
      dispatch(setToken(data.token));
      dispatch(setAuthenticated(true));
      dispatch(setError(null));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error de red';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const logoutUser = () => {
  try {
    return async (dispatch) => {
      await axios.put(`${USERS}/logout`, { withCredentials: true });
      dispatch(logout());
    };
  } catch (error) {
    console.log(error);
  }
};

export const setErrorAuth = (payload) => {
  return (dispatch) => {
    dispatch(setError(payload));
  };
};
