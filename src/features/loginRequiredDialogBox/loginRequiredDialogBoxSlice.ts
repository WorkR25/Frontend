import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LoginRequiredContext = {
  /** What the visitor was trying to do. */
  reason?: "apply" | "referral" | null;
  jobTitle?: string;
  companyName?: string;
  companyLogo?: string | null;
};

type State = { value: boolean; context: LoginRequiredContext | null };

const initialState: State = { value: false, context: null };

const loginRequiredDialogBoxSlice = createSlice({
  name: "loginRequiredDialogBox",
  initialState,
  reducers: {
    setLoginRequiredDialogBox: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
      if (!action.payload) state.context = null;
    },
    /** Open the dialog with details about what the visitor was trying to do. */
    openLoginRequired: (state, action: PayloadAction<LoginRequiredContext>) => {
      state.value = true;
      state.context = action.payload;
    },
  },
});

export const { setLoginRequiredDialogBox, openLoginRequired } = loginRequiredDialogBoxSlice.actions;

export default loginRequiredDialogBoxSlice.reducer;
