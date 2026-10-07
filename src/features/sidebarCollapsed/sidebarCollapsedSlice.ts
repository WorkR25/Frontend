import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Desktop sidebar: false = full width, true = icon-only rail. */
const sidebarCollapsedSlice = createSlice({
  name: "sidebarCollapsed",
  initialState: { value: false },
  reducers: {
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.value = !state.value;
    },
  },
});

export const { setSidebarCollapsed, toggleSidebarCollapsed } = sidebarCollapsedSlice.actions;
export default sidebarCollapsedSlice.reducer;
