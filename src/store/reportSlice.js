import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmPopUpOpened: false,
};

const reportSlice = createSlice({
  name: "reportSlice",
  initialState,
  reducers: {
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default reportSlice.reducer;
export const { openConfirmPopUp } = reportSlice.actions;
