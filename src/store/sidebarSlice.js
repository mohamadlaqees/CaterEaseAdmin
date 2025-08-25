import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpened: false,
};

const sidebarSlice = createSlice({
  name: "sidebarSlice",
  initialState,
  reducers: {
    openSidebar: (state, action) => {
      state.sidebarOpened = action.payload.sidebarOpened;
    },
  },
});

export default sidebarSlice.reducer;
export const { openSidebar } = sidebarSlice.actions;
