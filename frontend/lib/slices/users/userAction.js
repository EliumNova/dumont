import axios from 'axios';
import { USERS } from '../constants';
import { allUsers, newUser, updateUser, deleteUsuario } from './userSlice';

export const userCreate = (payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${USERS}/create`, payload);
      dispatch(newUser(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getAllUsers = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(USERS);
      dispatch(allUsers(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const userUpdate = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(`${USERS}/update/${id}`, payload);
      dispatch(updateUser(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};

// async + await: así el llamador puede esperar a que termine antes de refrescar la tabla.
export const usuarioDelete = (id) => {
  return async (dispatch) => {
    try {
      const res = await axios.delete(`${USERS}/delete/${id}`);
      dispatch(deleteUsuario(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};
