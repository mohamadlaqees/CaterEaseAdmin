import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./sidebarSlice";
import dashboardSlice from "./dashboardSlice";
import ownerSlice from "./ownerSlice";
import restaurantSlice from "./restaurantSlice";
import reportSlice from "./reportSlice";
import { apiSlice } from "./apiSlice/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice,
    dash: dashboardSlice,
    owner: ownerSlice,
    restaurant: restaurantSlice,
    report: reportSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
setupListeners(store.dispatch);

export default store;
