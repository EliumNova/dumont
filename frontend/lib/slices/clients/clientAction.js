import axios from 'axios';
import { CLIENTS } from '../constants';
import {
  setClients,
  addClient,
  updateClient,
  removeClient,
} from './clientSlice';

export const fetchClients = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(CLIENTS);
      console.log('fetchClients response:', res.data); // Log para verificar la respuesta
      dispatch(setClients(res.data.rows)); // Asegúrate de despachar 'rows' si es lo que contiene la lista de clientes
    } catch (err) {
      console.log(err);
    }
  };
};

export const createClient = (payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${CLIENTS}/create`, payload);
      console.log('createClient response:', res.data); // Log para verificar la respuesta
      dispatch(addClient(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const updateClientData = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(`${CLIENTS}/update/${id}`, payload);
      console.log('updateClientData response:', res.data); // Log para verificar la respuesta
      dispatch(updateClient(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteClient = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`${CLIENTS}/delete/${id}`);
      console.log('deleteClient response:', id); // Log para verificar la respuesta
      dispatch(removeClient(id));
    } catch (err) {
      console.log(err);
    }
  };
};
