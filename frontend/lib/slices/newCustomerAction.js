export const SET_PRINCIPALES = 'SET_PRINCIPALES';
export const SET_UBICACION = 'SET_UBICACION';
export const SET_HORUS = 'SET_HORUS';

export const setPrincipales = (principales) => ({
  type: SET_PRINCIPALES,
  payload: principales,
});

export const setUbicacion = (ubicacion) => ({
  type: SET_UBICACION,
  payload: ubicacion,
});

export const setHorus = (horus) => ({
  type: SET_HORUS,
  payload: horus,
});
