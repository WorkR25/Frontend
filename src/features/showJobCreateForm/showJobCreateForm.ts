import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showJobCreateFormSlice = createSlice({
    name: 'showJobCreateForm',
    initialState: {value: false},
    reducers: {
        setShowJobCreateForm: (state, action: PayloadAction<boolean>)=>{
            state.value = action.payload;
        },
        toogleShowJobCreateForm: (state)=>{
            state.value= !state.value;
        }
    }
})


export const { setShowJobCreateForm, toogleShowJobCreateForm } = showJobCreateFormSlice.actions;

export default showJobCreateFormSlice.reducer;