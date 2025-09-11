import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showAddTitleFormSlice= createSlice({
    name: "showAddTitleForm",
    initialState: {value: false} ,
    reducers: {
        toogleShowAddTitleForm: (state)=>{
            state.value = !state.value
        },

        setShowAddTitleForm: (state, action: PayloadAction<boolean>)=>{
            state.value= action.payload
        }
    }
})

export const {  toogleShowAddTitleForm, setShowAddTitleForm } = showAddTitleFormSlice.actions ;

export default showAddTitleFormSlice.reducer ;