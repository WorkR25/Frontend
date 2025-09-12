import { createSlice } from "@reduxjs/toolkit";

export const showAllCandidatesSlice = createSlice({
    name: "showAllCandidates",
    initialState: {value: false} ,
    reducers: {
        setShowAllCandidates: (state, action)=>{
            state.value = action.payload
        },
        toogleShowAllCandidates: (state)=>{
            state.value = !state.value
        }
    
    }

})

export const {  toogleShowAllCandidates, setShowAllCandidates } = showAllCandidatesSlice.actions ;

export default showAllCandidatesSlice.reducer ;