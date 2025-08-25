import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmPopUpOpened: false,
};

const restaurantSlice = createSlice({
  name: "restaurantSlice",
  initialState,
  reducers: {
    openConfirmPopUp: (state, action) => {
      state.confirmPopUpOpened = action.payload;
    },
  },
});

export default restaurantSlice.reducer;
export const { openConfirmPopUp } = restaurantSlice.actions;
