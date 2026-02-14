import axios from "axios";
import { DISTRIBUIDORES } from "../constants";
import {
  allDistribuidores,
  newDistribuidor,
  updateDistribuidor,
  deleteDistribuidor,
} from "./distribuidorSlice";

export const distribuidorCreate = (payload) => {
  return (dispatch) => {
    axios
      .post(`${DISTRIBUIDORES}/create`, payload)
      .then((res) => dispatch(newDistribuidor(res.data)))
      .catch((err) => console.log(err));
  };
};

export const getDistribuidores = ({ page = 0, pageSize = 15 } = {}) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${DISTRIBUIDORES}?page=${page}&pageSize=${pageSize}`
      );
      dispatch(allDistribuidores(res.data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const distribuidorUpdate = (id, payload) => {
  return async (dispatch) => {
    await axios
      .put(`${DISTRIBUIDORES}/update/${id}`, payload)
      .then((res) => dispatch(updateDistribuidor(res.data)))
      .catch((err) => console.log(err));
  };
};

export const distribuidorDelete = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`${DISTRIBUIDORES}/delete/${id}`);
      dispatch(deleteDistribuidor(id)); // 👈 mandamos el ID
    } catch (err) {
      console.log(err);
    }
  };
};
