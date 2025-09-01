import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showAddSkillsFormSlice= createSlice({
    name: "showAddSkillsForm",
    initialState: {value: false} ,
    reducers: {
        toogleShowAddSkillsForm: (state)=>{
            state.value = !state.value
        },

        setShowAddSkillsForm: (state, action: PayloadAction<boolean>)=>{
            state.value= action.payload
        }
    }
})

export const { toogleShowAddSkillsForm, setShowAddSkillsForm } = showAddSkillsFormSlice.actions ;

export default showAddSkillsFormSlice.reducer ;