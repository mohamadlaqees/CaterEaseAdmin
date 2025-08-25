import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  earnings: {},
};

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {
    setEarnings: (state, action) => {
      state.earnings = action.payload;
    },
  },
});

export default dashboardSlice.reducer;
export const { setEarnings } = dashboardSlice.actions;
