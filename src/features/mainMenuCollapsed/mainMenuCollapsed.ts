import { createSlice } from "@reduxjs/toolkit";

const mainMenuCollapsedSlice = createSlice({
    name: "mainMenuCollapsed",
    initialState: {value : false},
    reducers: {
        mainMenuCollapsedToogle: (state)=>{
            state.value = !state.value;
        }
    } 
});

export const { mainMenuCollapsedToogle } = mainMenuCollapsedSlice.actions

export default mainMenuCollapsedSlice.reducer ;