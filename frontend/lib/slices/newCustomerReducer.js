import {
  SET_PRINCIPALES,
  SET_UBICACION,
  SET_HORUS,
} from './newCustomerActions';

const initialState = {
  principales: {},
  ubicacion: {},
  horus: {},
};

const newCustomerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRINCIPALES:
      return { ...state, principales: action.payload };
    case SET_UBICACION:
      return { ...state, ubicacion: action.payload };
    case SET_HORUS:
      return { ...state, horus: action.payload };
    default:
      return state;
  }
};

export default newCustomerReducer;
