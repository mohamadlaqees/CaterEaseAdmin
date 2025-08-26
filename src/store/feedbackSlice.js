import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmPopUpOpened: false,
};

const feedbackSlice = createSlice({
  name: "feedbackSlice",
  initialState,
  reducers: {
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default feedbackSlice.reducer;
export const { openConfirmPopUp } = feedbackSlice.actions;
