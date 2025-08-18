import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showJobApplicantsSlice = createSlice({
    name: 'showJobApplicants',
    initialState: {value: false},
    reducers: {
        setShowJobApplicants: (state, action: PayloadAction<boolean>)=>{
            state.value = action.payload;
        },
        toogleShowJobApplicants: (state)=>{
            state.value= !state.value;
        }
    }
})


export const { setShowJobApplicants, toogleShowJobApplicants } = showJobApplicantsSlice.actions;

export default showJobApplicantsSlice.reducer;