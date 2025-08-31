import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showAddSkillsFormSlice= createSlice({
    name: "showAddSkillsForm",
    initialState: {value: false} ,
    reducers: {
        toogleShowAddSkillsFormSlice: (state)=>{
            state.value = !state.value
        },

        setShowAddSkillsFormSlice: (state, action: PayloadAction<boolean>)=>{
            state.value= action.payload
        }
    }
})

export const { toogleShowAddSkillsFormSlice, setShowAddSkillsFormSlice } = showAddSkillsFormSlice.actions ;

export default showAddSkillsFormSlice.reducer ;