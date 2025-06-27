const axios = require('axios');
import { DISPOSITIVOS } from '../constants';
import {
  allDispositivos,
  newDispositivo,
  updateDispositivo,
  deleteDispositivo,
} from './dispositivoSlice';

export const dispositivoCreate = (payload) => {
  console.log(payload);

  return (dispatch) => {
    axios
      .post(`${DISPOSITIVOS}/create`, payload)
      .then((res) => dispatch(newDispositivo(res.data)))
      .catch((err) => console.log(err));
  };
};

export const getDispositivos = ({ page = 0, pageSize = 5 } = {}) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${DISPOSITIVOS}?page=${page}&pageSize=${pageSize}`
      );
      dispatch(allDispositivos(res.data));
    } catch (err) {
      console.log('Error al obtener dispositivos:', err);
    }
  };
};

export const dispositivoUpdate = (id, payload) => {
  console.log(id, payload);

  return async (dispatch) => {
    await axios
      .put(`${DISPOSITIVOS}/update/${id}`, payload)
      .then((res) => dispatch(updateDispositivo(res.data)))
      .catch((err) => console.log(err));
  };
};

export const dispositivoDelete = (id) => {
  console.log(id);

  return (dispatch) => {
    axios
      .delete(`${DISPOSITIVOS}/delete/${id}`)
      .then((res) => dispatch(deleteDispositivo(res.data)))
      .catch((err) => console.log(err));
  };
};
