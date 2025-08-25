import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmPopUpOpened: false,
};

const ownerSlice = createSlice({
  name: "ownerSlice",
  initialState,
  reducers: {
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default ownerSlice.reducer;
export const { openConfirmPopUp } = ownerSlice.actions;
