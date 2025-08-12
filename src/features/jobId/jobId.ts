import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const JobIdSlice = createSlice({
    name: "jobId",
    initialState: {value : ""},
    reducers: {
        setJobId: (state, action: PayloadAction<string>)=>{
            state.value = action.payload;
        }
    } 
});

export const { setJobId } = JobIdSlice.actions;
export default JobIdSlice.reducer;