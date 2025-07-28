import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const authJwtTokenSlice = createSlice({
  name: "authJwtToken",
  initialState: { value: "" },
  reducers: {
    setAuthJwtToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    }
  }
});


export const { setAuthJwtToken } = authJwtTokenSlice.actions;
export default authJwtTokenSlice.reducer;