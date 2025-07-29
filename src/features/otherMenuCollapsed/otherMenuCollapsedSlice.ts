import { createSlice } from "@reduxjs/toolkit";

export const otherMenuCollapsedSlice = createSlice({
    name: 'otherMenuCollapsed',
    initialState: {value: false},
    reducers: {
        otherMenuCollapsedToogle: (state)=>{
            state.value = !state.value;
        }
    }
})


export const { otherMenuCollapsedToogle } = otherMenuCollapsedSlice.actions;

export default otherMenuCollapsedSlice.reducer;