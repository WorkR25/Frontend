import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showSearchCandidatesByNameSlice = createSlice({
  name: "showSearchCandidatesByName",
  initialState: { value: false },
  reducers: {
    setShowSearchCandidatesByName: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setShowSearchCandidatesByName } =
  showSearchCandidatesByNameSlice.actions;

export default showSearchCandidatesByNameSlice.reducer;
