const initialState = {
  allRelaciones: [],
};

export default function clientesDistribuidoresReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case 'SET_RELACIONES_CLIENTES_DISTRIBUIDORES':
      return {
        ...state,
        allRelaciones: action.payload,
      };
    default:
      return state;
  }
}
