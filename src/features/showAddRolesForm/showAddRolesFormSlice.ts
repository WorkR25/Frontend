import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showAddRolesFormSlice= createSlice({
    name: "showAddRolesForm",
    initialState: {value: false} ,
    reducers: {
        toogleShowAddRolesForm: (state)=>{
            state.value = !state.value
        },

        setShowAddRolesForm: (state, action: PayloadAction<boolean>)=>{
            state.value= action.payload
        }
    }
})

export const { toogleShowAddRolesForm, setShowAddRolesForm } = showAddRolesFormSlice.actions ;

export default showAddRolesFormSlice.reducer ;