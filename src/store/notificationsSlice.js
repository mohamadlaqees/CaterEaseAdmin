import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notificationsSlice",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },

    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
    clearAllNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export default notificationsSlice.reducer;
export const { addNotification, markAllAsRead, clearAllNotifications } =
  notificationsSlice.actions;
