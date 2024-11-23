import { USERS } from "./constants";
import { setAuthenticated, setUser, setToken, setError, setLoading } from "./authSlice";
const axios = require('axios');

// export const login = (payload) => {
//     console.log(payload);
    
//     return (dispatch) => {
//         axios.post(`${USERS}/login`, payload, { withCredentials: true })
//             .then(res => {
//                 console.log("Response", res.data);
                
//                 const {data} = res;
//                 dispatch(setUser(data))
//                 dispatch(setToken(data.token))
//                 dispatch(setAuthenticated(true))
//                 dispatch(setError(null))
//     })
//             .catch(err => console.log(err));
            
//         }
// }

export const login = (payload) => {
  console.log(payload);
  
    return async (dispatch) => {
      dispatch(setLoading(true));
      try {
        const res = await axios.post(`${USERS}/login`, payload, { withCredentials: true });
        const { data } = res;
        dispatch(setUser(data));
        dispatch(setToken(data.token));
        dispatch(setAuthenticated(true));
        dispatch(setError(null));
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error de red';
        dispatch(setError(errorMessage));
      } 
      finally {
        dispatch(setLoading(false));
      }
    }
}

export const setErrorAuth = (payload) => {
  return(dispatch) => {dispatch(setError(payload))}
}