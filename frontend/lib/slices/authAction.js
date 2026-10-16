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

// El backend devuelve la PK como idUsuarios; el login la devuelve como id.
// Se unifica para que la UI use siempre user.id y nunca guarde el password.
const normalizeUser = (data = {}) => {
  // eslint-disable-next-line no-unused-vars
  const { Password, verifyToken, expireToken, ...resto } = data;
  return { ...resto, id: data.id ?? data.idUsuarios };
};

export const fetchUserData = (userId) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${USERS}/${userId}`, {
        withCredentials: true,
      });
      const { data } = res;

      // Actualizar el estado de Redux con los datos del usuario
      dispatch(setUser(normalizeUser(data)));
    } catch (err) {
      console.error('Error al obtener los datos del usuario:', err);
      dispatch(setError('Error al obtener los datos del usuario'));
    }
  };
};

// Lee el payload (sin verificar firma: eso lo hace el servidor) para saber el
// id del usuario y si el token ya venció.
export const leerTokenLocal = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch {
    return null;
  }
};

// Restaura la sesión desde localStorage. Devuelve true si hay una sesión
// vigente, false si no (sin token, malformado o vencido).
export const initializeAuth = () => {
  return (dispatch) => {
    const token = localStorage.getItem('authToken');
    const payload = token ? leerTokenLocal(token) : null;
    const vencido = payload?.exp ? payload.exp * 1000 <= Date.now() : false;

    if (!token || !payload?.id || vencido) {
      dispatch(logoutUser());
      return false;
    }

    localStorage.setItem('userId', payload.id);
    localStorage.setItem('isAuthenticated', 'true');
    dispatch(setToken(token));
    dispatch(setAuthenticated(true));
    dispatch(fetchUserData(payload.id));
    return true;
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

// Actualiza el perfil. Devuelve true/false para que la UI muestre el resultado.
// El token y el id actuales se conservan (el update no emite token nuevo).
export const updateAuthUser = (id, payload) => {
  return async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.put(`${USERS}/update/${id}`, payload, {
        withCredentials: true,
      });
      const actual = getState().auth.user || {};
      dispatch(setUser({ ...actual, ...normalizeUser(res.data) }));
      dispatch(setError(null));
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error de red';
      dispatch(setError(errorMessage));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// Cierra la sesión: el JWT es stateless, así que alcanza con borrar la sesión
// local (antes se llamaba a un endpoint /logout que no existe y fallaba).
export const logoutUser = () => (dispatch) => {
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
  } catch {
    /* sin storage disponible */
  }
  dispatch(logout());
};

export const setErrorAuth = (payload) => {
  return (dispatch) => {
    dispatch(setError(payload));
  };
};
