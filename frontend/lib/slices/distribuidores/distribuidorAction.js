const axios = require('axios');
import { DISTRIBUIDORES } from '../constants';
import {
  allDistribuidores,
  newDistribuidor,
  updateDistribuidor,
  deleteDistribuidor,
} from './distribuidorSlice';

export const distribuidorCreate = (payload) => {
  console.log(payload);

  return (dispatch) => {
    axios
      .post(`${DISTRIBUIDORES}/create`, payload)
      .then((res) => dispatch(newDistribuidor(res.data)))
      .catch((err) => console.log(err));
  };
};

export const getDistribuidores = ({ page = 0, pageSize = 5 } = {}) => {
  return async (dispatch) => {
    try {
      // Pasa los parámetros en la URL
      const res = await axios.get(`${DISTRIBUIDORES}?page=${page}&pageSize=${pageSize}`);
      console.log('getDistribuidores response: ', res.data);

      // Despacha todo el objeto con count y rows
      dispatch(allDistribuidores(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};


export const distribuidorUpdate = (id, payload) => {
  console.log(id, payload);

  return async (dispatch) => {
    await axios
      .put(`${DISTRIBUIDORES}/update/${id}`, payload)
      .then((res) => dispatch(updateDistribuidor(res.data)))
      .catch((err) => console.log(err));
  };
};

export const distribuidorDelete = (id) => {
  console.log(id);

  return (dispatch) => {
    axios
      .delete(`${DISTRIBUIDORES}/delete/${id}`)
      .then((res) => dispatch(deleteDistribuidor(res.data)))
      .catch((err) => console.log(err));
  };
};
