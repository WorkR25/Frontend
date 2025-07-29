import { createSlice } from "@reduxjs/toolkit";

const isSidebarOpenSlice = createSlice({
    name: "isSidebarOpen",
    initialState: {value : false},
    reducers: {
        isSidebarOpenToogle: (state)=>{
            state.value = !state.value;
        }
    } 
});

export const { isSidebarOpenToogle } = isSidebarOpenSlice.actions

export default isSidebarOpenSlice.reducer ;