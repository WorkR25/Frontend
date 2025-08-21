import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showJobUpdateFormSlice = createSlice({
    name: 'showJobCreateForm',
    initialState: {value: false},
    reducers: {
        setShowJobupdateForm: (state, action: PayloadAction<boolean>)=>{
            state.value = action.payload;
        }
    }
})


export const { setShowJobupdateForm } = showJobUpdateFormSlice.actions;

export default showJobUpdateFormSlice.reducer;