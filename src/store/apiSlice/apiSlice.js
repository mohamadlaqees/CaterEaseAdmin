import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
    prepareHeaders: (header) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        header.set("Authorization", `Bearer ${token}`);
      }
      header.set("Accept", "application/json");
      return header;
    },
  }),
  tagTypes: ["Restaurants", "packages", "discount", "owners", "owner"],
  endpoints: (build) => ({
    // Auth
    logIn: build.mutation({
      query: (userInfo) => ({
        url: "login",
        method: "POST",
        body: {
          ...userInfo,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.access_token) {
            localStorage.setItem("authToken", data.access_token);
            dispatch(apiSlice.endpoints.restaurantInfo.initiate());
          }
        } catch (error) {
          console.error("Login onQueryStarted error:", error);
        }
      },
    }),
    logOut: build.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("authToken");
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          console.error("Logout failed:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("restaurantID");
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),

    // Dashboard
    statistics: build.query({
      query: () => `statistics`,
    }),
    restaurantsPerformance: build.query({
      query: () => `restaurants-summary`,
    }),
    totalSellingItems: build.query({
      query: () => `popular-packages`,
    }),
    restaurantStatistics: build.query({
      query: (restaurantID) => `restaurants/${restaurantID}/stats`,
    }),

    //Restaurants
    restaurants: build.query({
      query: () => `restaurants`,
      providesTags: ["Restaurants"],
    }),
    restaurantDetails: build.query({
      query: (restaurantID) => `restaurants/${restaurantID}`,
    }),
    addRestaurant: build.mutation({
      query: (restaurantInfo) => ({
        url: "restaurants",
        method: "POST",
        body: {
          ...restaurantInfo,
        },
      }),
      invalidatesTags: ["Restaurants"],
    }),
    updateRestaurant: build.mutation({
      query: ({ restaurantID, body }) => ({
        url: `restaurants/${restaurantID}`,
        method: "PUT",
        body: {
          ...body,
        },
      }),
      invalidatesTags: ["Restaurants"],
    }),
    deleteRestaurant: build.mutation({
      query: (restaurantID) => ({
        url: `restaurants/${restaurantID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Restaurants"],
    }),

    //Owners
    owners: build.query({
      query: () => `users/all/Owner`,
      providesTags: ["owners"],
    }),
    ownerDetails: build.query({
      query: (ownerID) => `users/${ownerID}`,
      providesTags: ["owner"],
    }),
    deleteOwner: build.mutation({
      query: (ownerID) => ({
        url: `users/${ownerID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["owners"],
    }),
    addOwner: build.mutation({
      query: ({ payload }) => ({
        url: "users",
        method: "POST",
        body: {
          ...payload,
        },
      }),
      invalidatesTags: ["owners"],
    }),
    editOwner: build.mutation({
      query: ({ ownerID, payload }) => ({
        url: `users/${ownerID}`,
        method: "PUT",
        body: {
          ...payload,
        },
      }),
      invalidatesTags: ["owner"],
    }),
    searchOwnerByName: build.query({
      query: (ownerName) => `users/all/Owner??name=${ownerName}`,
    }),
    searchOwnerByStatus: build.query({
      query: (ownerStatus) => `users/all/Owner??status=${ownerStatus}`,
    }),
    searchOwnerByDate: build.query({
      query: (date) => `users/all/Owner??date=${date}`,
    }),

    //complaints & reports
    complaints: build.query({
      query: () => "complaints",
    }),
    reports: build.query({
      query: () => `report/admin`,
    }),
    changeFeedbackStatus: build.mutation({
      query: ({ reviewID, status }) => ({
        url: `update-staus-compalant/${reviewID}`,
        method: "POST",
        body: {
          status,
        },
      }),
    }),
    deleteReview: build.mutation({
      query: (reviewID) => ({
        url: `update-staus-compalant/${reviewID}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLogInMutation,
  useLogOutMutation,
  useStatisticsQuery,
  useRestaurantsPerformanceQuery,
  useRestaurantsQuery,
  useTotalSellingItemsQuery,
  useRestaurantStatisticsQuery,
  useRestaurantDetailsQuery,
  useAddRestaurantMutation,
  useUpdateRestaurantMutation,
  useOwnersQuery,
  useOwnerDetailsQuery,
  useDeleteOwnerMutation,
  useEditOwnerMutation,
  useAddOwnerMutation,
  useSearchOwnerByNameQuery,
  useSearchOwnerByStatusQuery,
  useSearchOwnerByDateQuery,
  useDeleteRestaurantMutation,
  useComplaintsQuery,
  useReportsQuery,
  useChangeFeedbackStatusMutation,
  useDeleteReviewMutation,
} = apiSlice;
