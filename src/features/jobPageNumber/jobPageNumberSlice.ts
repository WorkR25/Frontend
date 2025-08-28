import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const jobPageNumberSlice = createSlice({
    name: "jobPageNumber",
    initialState: {value : 1, totalPages: -1},
    reducers: {
        incrementJobPageCount: (state)=>{
            state.value = state.value + 1 ;
            console.log(state.value)
        },

        decrementJobPageCount: (state)=>{
            state.value= state.value-1 ;
        },

        resetJobPageCount: (state)=> {
            state.value = 1 ;
        },

        setTotalJobPages: (state, action: PayloadAction<number>) =>{
            state.totalPages = action.payload
        }
    } 
});

export const { incrementJobPageCount, decrementJobPageCount, resetJobPageCount, setTotalJobPages } = jobPageNumberSlice.actions

export default jobPageNumberSlice.reducer ;