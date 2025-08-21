import { JobDetails } from "@/types/JobDetailsType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type JobDetailsState = {
  value: JobDetails | null; 
};

const initialState: JobDetailsState = {
  value: null,
};

const jobDetailsSlice = createSlice({
  name: "jobDetails",
  initialState,
  reducers: {
    setJobDetails: (state, action: PayloadAction<JobDetails>) => {
      state.value = action.payload;
    },
    resetJobDetails: (state) => {
      state.value = null; 
    },
  },
});

export const { setJobDetails, resetJobDetails } = jobDetailsSlice.actions;
export default jobDetailsSlice.reducer;
