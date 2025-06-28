import axios from 'axios';
import { CLIENTS } from '../constants';
import {
  setClients,
  addClient,
  updateClient,
  removeClient,
} from './clientSlice';

export const fetchClients = ({ page = 0, pageSize = 5 } = {}) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(CLIENTS, {
        params: { page, pageSize },
      });
      dispatch(setClients(res.data)); // Asegurate que res.data tenga count y rows
    } catch (err) {
      console.log(err);
    }
  };
};

export const createClient = (payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${CLIENTS}/create`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Respuesta de la API:', res.data);
      dispatch(addClient(res.data));
    } catch (err) {
      console.error('Error al enviar datos a la API:', err);
      throw err; // Propaga el error para manejarlo en el componente
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
