import { createSlice } from "@reduxjs/toolkit";


export const userSlice = createSlice({
    name: "user",
    initialState: {
        allUsers: [],
        newUser: {},
        updateUser: {},
        deleteUsuario: {}
    },
    reducers: {
        newUser: (state, {payload}) => {
            state.newUser = payload
        },
        allUsers: (state, {payload}) => {
            state.allUsers = payload
        },
        updateUser: (state, {payload}) => {
            state.updateUser = payload
        },
        deleteUsuario: (state, {payload}) => {
            state.deleteUsuario = payload
        }
    }
})


export const { allUsers, newUser, updateUser, deleteUsuario} = userSlice.actions;

export default userSlice.reducer;