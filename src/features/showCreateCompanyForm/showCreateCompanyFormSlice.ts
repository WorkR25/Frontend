import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showCreateCompanyFormSlice= createSlice({
    name: "showCreateCompanyForm",
    initialState: {value: false} ,
    reducers: {
        toogleShowCreateCompanyForm: (state)=>{
            state.value = !state.value
        },

        setShowCreateCompanyForm: (state, action: PayloadAction<boolean>)=>{
            state.value= action.payload
        }
    }
})

export const { toogleShowCreateCompanyForm, setShowCreateCompanyForm } = showCreateCompanyFormSlice.actions ;

export default showCreateCompanyFormSlice.reducer ;