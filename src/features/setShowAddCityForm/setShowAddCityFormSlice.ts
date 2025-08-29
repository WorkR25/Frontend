import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showAddCityFormSlice = createSlice({
    name: "showAddCity",
    initialState: { value: false },
    reducers: {
        toggleShowAddCityForm: (state) => {
            state.value = !state.value;
        },
        setShowAddCityForm: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        },
    },
});

export const { toggleShowAddCityForm, setShowAddCityForm } = showAddCityFormSlice.actions;

export default showAddCityFormSlice.reducer;
