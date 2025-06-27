const axios = require("axios");
import { USERS } from "../constants";
import { allUsers, newUser, updateUser, deleteUsuario } from "./userSlice";


export const userCreate = (payload) => {
    console.log(payload);
    
    return(dispatch) => {
        axios.post(`${USERS}/create`, payload)
        .then(res => dispatch(newUser(res.data)))
        .catch(err => console.log(err))        
    }
}

export const getAllUsers = () => {
    return async (dispatch) => {
        await axios
            .get(USERS)
            .then(res => dispatch(allUsers(res.data)))
            .catch(err => console.log(err));            
    }
}

export const userUpdate = (id, payload) => {
    console.log(id, payload);

    return async (dispatch) => {
        await axios.put(`${USERS}/update/${id}`, payload)
        .then(res => dispatch(updateUser(res.data)))
        .catch(err => console.log(err))
    }    
}

export const usuarioDelete = (id) => {
    console.log(id);

    return(dispatch) => {
        axios.delete(`${USERS}/delete/${id}`)
        .then(res => dispatch(deleteUsuario(res.data)))
        .catch(err => console.log(err))
    }    
}
