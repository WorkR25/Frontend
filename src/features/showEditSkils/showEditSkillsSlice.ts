import { Skills } from "@/types/JobDetailsType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  FieldValues, Path } from "react-hook-form";

type TFormValues = FieldValues;

type ShowEditSkillsState = {
  value: boolean;
  fieldName: Path<TFormValues> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  jwtToken: string | null;
  fieldValue?: Skills[] ;
//   handleSkillDelete?: ((id: number) => void) | null;
//   handleSkillAdd?: ((id: number, name: string) => void) | null;
};

const initialState: ShowEditSkillsState = {
  value: false,
  fieldName: null,
  setValue: null,
  error: undefined,
  jwtToken: null,
  fieldValue: undefined,
//   handleSkillDelete: null,
//   handleSkillAdd: null,
};

export const showEditSkillsSlice = createSlice({
  name: "showEditSkills",
  initialState,
  reducers: {
    toggleShowEditSkills: (state) => {
      state.value = !state.value;
    },

    setShowEditSkills :(state, action: PayloadAction<boolean>)=>{
        state.value= action.payload
    },

    setShowEditSkillsPayload: (state, action: PayloadAction<ShowEditSkillsState>) => {
      const {
        fieldName,
        setValue,
        error,
        jwtToken,
        fieldValue,
        // handleSkillDelete,
        // handleSkillAdd,
      } = action.payload;

      state.fieldName = fieldName;
      state.setValue = setValue;
      state.error = error;
      state.jwtToken = jwtToken;
      state.fieldValue = fieldValue;
    //   state.handleSkillDelete = handleSkillDelete;
    //   state.handleSkillAdd = handleSkillAdd;
    },
  },
});

export const { toggleShowEditSkills, setShowEditSkills, setShowEditSkillsPayload } = showEditSkillsSlice.actions;
export default showEditSkillsSlice.reducer;
