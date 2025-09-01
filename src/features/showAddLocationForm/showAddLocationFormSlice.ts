import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showAddLocationFormSlice = createSlice({
    name: "showAddLocation",
    initialState: { value: false },
    reducers: {
        toggleShowAddLocationForm: (state) => {
            state.value = !state.value;
        },
        setShowAddLocationForm: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        },
    },
});

export const { toggleShowAddLocationForm, setShowAddLocationForm } = showAddLocationFormSlice.actions;

export default showAddLocationFormSlice.reducer;
