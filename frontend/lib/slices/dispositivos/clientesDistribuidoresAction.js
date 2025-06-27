import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRelacionesClientesDistribuidores = () => async (dispatch) => {
  try {
    const res = await axios.get(
      'http://localhost:3001/api/clientes-distribuidores'
    );
    dispatch({
      type: 'SET_RELACIONES_CLIENTES_DISTRIBUIDORES',
      payload: res.data,
    });
  } catch (error) {
    console.error('Error al obtener relaciones cliente-distribuidor:', error);
  }
};
