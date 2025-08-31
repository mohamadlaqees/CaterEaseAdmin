import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./sidebarSlice";
import dashboardSlice from "./dashboardSlice";
import ownerSlice from "./ownerSlice";
import restaurantSlice from "./restaurantSlice";
import feedbackSlice from "./feedbackSlice";
import notificationsSlice from "./notificationsSlice";
import { apiSlice } from "./apiSlice/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice,
    dash: dashboardSlice,
    owner: ownerSlice,
    restaurant: restaurantSlice,
    feedback: feedbackSlice,
    notification: notificationsSlice,

    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
setupListeners(store.dispatch);

export default store;
