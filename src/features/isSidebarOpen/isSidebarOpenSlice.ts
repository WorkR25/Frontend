import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const isSidebarOpenSlice = createSlice({
    name: "isSidebarOpen",
    initialState: {value : false},
    reducers: {
        isSidebarOpenToogle: (state, action: PayloadAction<boolean>)=>{
            state.value = action? action.payload : !state.value;
        }
    } 
});

export const { isSidebarOpenToogle } = isSidebarOpenSlice.actions

export default isSidebarOpenSlice.reducer ;