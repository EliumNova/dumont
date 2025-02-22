const axios = require("axios");
import { DISTRIBUIDORES } from "../constants";
import { allDistribuidores, newDistribuidor, updateDistribuidor, deleteDistribuidor } from "./distribuidorSlice";


export const distribuidorCreate = (payload) => {
    console.log(payload);
    
    return(dispatch) => {
        axios.post(`${DISTRIBUIDORES}/create`, payload)
        .then(res => dispatch(newDistribuidor(res.data)))
        .catch(err => console.log(err))        
    }
}

export const getDistribuidores = () => {
    return async (dispatch) => {
        await axios
            .get(DISTRIBUIDORES)
            .then(res => dispatch(allDistribuidores(res.data)))
            .catch(err => console.log(err));            
    }
}

export const distribuidorUpdate = (id, payload) => {
    console.log(id, payload);

    return async (dispatch) => {
        await axios.put(`${DISTRIBUIDORES}/update/${id}`, payload)
        .then(res => dispatch(updateDistribuidor(res.data)))
        .catch(err => console.log(err))
    }    
}

export const distribuidorDelete = (id) => {
    console.log(id);

    return(dispatch) => {
        axios.delete(`${DISTRIBUIDORES}/delete/${id}`)
        .then(res => dispatch(deleteDistribuidor(res.data)))
        .catch(err => console.log(err))
    }    
}