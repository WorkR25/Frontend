import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showSearchCandidatesSlice = createSlice({
    name: 'showSearchCandidates',
    initialState: {value: false},
    reducers: {
        setShowSearchCandidates: (state, action: PayloadAction<boolean>)=>{
            state.value = action.payload;
        }
    }
})


export const { setShowSearchCandidates } = showSearchCandidatesSlice.actions;

export default showSearchCandidatesSlice.reducer;