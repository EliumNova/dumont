import axios from "axios";
import { CLIENTS } from "../constants";
import {
  setClients,
  addClient,
  updateClient,
  removeClient,
} from "./clientSlice";

export const fetchClients = ({ page = 0, pageSize = 15, q = "" } = {}) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(CLIENTS, {
        params: { page, pageSize, ...(q ? { q } : {}) },
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
          "Content-Type": "application/json",
        },
      });
      dispatch(addClient(res.data));
    } catch (err) {
      console.error("Error al enviar datos a la API:", err);
      throw err; // Propaga el error para manejarlo en el componente
    }
  };
};

export const updateClientData = (id, payload) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(`${CLIENTS}/update/${id}`, payload);
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
      dispatch(removeClient(id));
    } catch (err) {
      console.log(err);
    }
  };
};
