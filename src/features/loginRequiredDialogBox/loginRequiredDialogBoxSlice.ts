import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const loginRequiredDialogBoxSlice = createSlice({
    name: "loginRequiredDialogBox",
    initialState: {value : false},
    reducers: {
        setLoginRequiredDialogBox: (state, action: PayloadAction<boolean>)=>{
            state.value = action.payload;
        }
    } 
});

export const { setLoginRequiredDialogBox } = loginRequiredDialogBoxSlice.actions

export default loginRequiredDialogBoxSlice.reducer ;