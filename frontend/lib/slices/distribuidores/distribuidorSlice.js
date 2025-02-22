import { createSlice } from "@reduxjs/toolkit";


export const distribuidorSlice = createSlice({
    name: "distribuidor",
    initialState: {
        allDistribuidores: [],
        newDistribuidor: {},
        updateDistribuidor: {},
        deleteDistribuidor: {}
    },
    reducers: {
        newDistribuidor: (state, {payload}) => {
            state.newDistribuidor = payload
        },
        allDistribuidores: (state, {payload}) => {
            state.allDistribuidores = payload
        },
        updateDistribuidor: (state, {payload}) => {
            state.updateDistribuidor = payload
        },
        deleteDistribuidor: (state, {payload}) => {
            state.deleteDistribuidor = payload
        }
    }
})


export const { allDistribuidores, newDistribuidor, updateDistribuidor, deleteDistribuidor} = distribuidorSlice.actions;

export default distribuidorSlice.reducer;


