import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const showSearchCandidatesByEmailSlice = createSlice({
  name: "showSearchCandidatesByEmail",
  initialState: { value: false },
  reducers: {
    setShowSearchCandidatesByEmail: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setShowSearchCandidatesByEmail } =
  showSearchCandidatesByEmailSlice.actions;

export default showSearchCandidatesByEmailSlice.reducer;
