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
    changeReviewsStatus: build.mutation({
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

    // packagesWithDiscount: build.query({
    //   query: () => `package-discounts/management`,
    //   providesTags: ["discount"],
    // }),
    // popularThisWeek: build.query({
    //   query: (restaurantID) => `orders/Popular-food-week/${restaurantID}`,
    // }),
    // bestSeller: build.query({
    //   query: (restaurantID) => `orders/best-sell/${restaurantID}`,
    // }),
    // promo: build.query({
    //   query: () => `descount/manage/all`,
    // }),
    // addpackage: build.mutation({
    //   query: (packageInfo) => ({
    //     url: `packagesmangement`,
    //     method: "POST",
    //     body: {
    //       ...packageInfo,
    //     },
    //   }),
    // }),
    // deletepackage: build.mutation({
    //   query: (packageID) => ({
    //     url: `packagesmangement/${packageID}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["category"],
    // }),
    // getPackage: build.query({
    //   query: (pacakgeID) => `packagesmangement/${pacakgeID}`,
    //   providesTags: ["updatePackage"],
    // }),
    // updatepackage: build.mutation({
    //   query: (updatedPackage) => ({
    //     url: `packagesmangement/${updatedPackage.id}`,
    //     method: "PUT",
    //     body: {
    //       ...updatedPackage,
    //     },
    //   }),
    //   invalidatesTags: ["updatePackage"],
    // }),
    // getOccasion: build.query({
    //   query: () => "occasion-types",
    // }),
    // addDiscount: build.mutation({
    //   query: (discount) => ({
    //     url: "package-discounts/management",
    //     method: "POST",
    //     body: {
    //       ...discount,
    //     },
    //   }),
    //   invalidatesTags: ["discount", "updatePackage", "category"],
    // }),
    // deleteDiscount: build.mutation({
    //   query: (discountID) => ({
    //     url: `package-discounts/${discountID}/management`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["discount", "updatePackage", "category"],
    // }),
    // restaurantServices: build.query({
    //   query: () => `service-types`,
    // }),

    // // Customers
    // customers: build.query({
    //   query: ({ restaurantID, search, date, status }) => {
    //     const params = new URLSearchParams();
    //     if (search) params.append("name", search);
    //     if (date) params.append("date", date);
    //     if (status) params.append("status", status);

    //     return `${
    //       (search === undefined &&
    //         date === undefined &&
    //         status === undefined) ||
    //       status === "all"
    //         ? `all_customer/${restaurantID}`
    //         : `Restaurants/${restaurantID}/customers/${
    //             search ? "search" : date ? "verified" : status ? "status" : ""
    //           }?${params.toString()}`
    //     }`;
    //   },
    // }),
    // customerDetails: build.query({
    //   query: (customerID) => `Restaurants/${customerID}/customer`,
    // }),
    // customerOrders: build.query({
    //   query: ({ customerID, orderStatus }) => {
    //     return `owner/customers/${customerID}/orders/${orderStatus}`;
    //   },
    // }),
    // coupon: build.mutation({
    //   query: (coupon) => ({
    //     url: "coupons/create",
    //     method: "POST",
    //     body: {
    //       ...coupon,
    //     },
    //   }),
    // }),

    // // Delivery
    // delivery: build.query({
    //   query: ({ search, date, status }) => {
    //     const params = new URLSearchParams();
    //     if (search) params.append("name", search);
    //     if (date) params.append("date", date);
    //     if (status) params.append("status", status);

    //     return `${
    //       search === undefined &&
    //       date === undefined &&
    //       (status === undefined || status === "all")
    //         ? `delivery-people/manage`
    //         : `delivery/manage?${params.toString()}`
    //     }`;
    //   },
    //   providesTags: ["Delivery"],
    // }),
    // addDeliveryEmployee: build.mutation({
    //   query: (DEInfo) => ({
    //     url: "delivery-people/manage",
    //     method: "POST",
    //     body: {
    //       ...DEInfo,
    //     },
    //   }),
    //   invalidatesTags: ["Delivery"],
    // }),
    // deliveryDetails: build.query({
    //   query: (deliveryID) => ({
    //     url: `delivery-people/manage/${deliveryID}`,
    //   }),
    //   providesTags: ["updateDelivery"],
    // }),
    // deleteDeliveryEmployee: build.mutation({
    //   query: (deliveryID) => ({
    //     url: `delivery-people/manage/${deliveryID}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Delivery"],
    // }),
    // deliveryOrders: build.query({
    //   query: (deliveryID) => `owner/delivery-person/${deliveryID}/orders`,
    // }),
    // editDeliveryEmployee: build.mutation({
    //   query: ({ deliveryEmployee, payload }) => ({
    //     url: `delivery-people/manage/${deliveryEmployee}`,
    //     method: "PUT",
    //     body: {
    //       ...payload,
    //     },
    //   }),
    //   invalidatesTags: ["updateDelivery"],
    // }),
    // orderHistory: build.query({
    //   query: () => `order/manange/allorder`,
    // }),
    // orderStatusSearch: build.query({
    //   query: (status) => `order/manange/${status}`,
    // }),

    // //Report
    // report: build.mutation({
    //   query: (report) => ({
    //     url: "/report",
    //     method: "POST",
    //     body: {
    //       ...report,
    //     },
    //   }),
    // }),

    // //reviews
    // reviews: build.query({
    //   query: () => "reviews/manage",
    // }),
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
  useChangeReviewsStatusMutation,
  useDeleteReviewMutation,
  // useCustomersQuery,
  // useReportMutation,
  // usePopularThisWeekQuery,
  // useBestSellerQuery,
  // usePromoQuery,
  // useCouponMutation,
  // useDeliveryQuery,
  // useCustomerDetailsQuery,
  // useCustomerOrdersQuery,
  // useAddDeliveryEmployeeMutation,
  // useDeliveryDetailsQuery,
  // useDeleteDeliveryEmployeeMutation,
  // useAddpackageMutation,
  // useGetPackageQuery,
  // useGetOccasionQuery,
  // useDeletepackageMutation,
  // useAddDiscountMutation,
  // useUpdatepackageMutation,
  // useDeleteDiscountMutation,
  // usePackagesWithDiscountQuery,
  // useReviewsQuery,
  // useDeliveryOrdersQuery,
  // useEditDeliveryEmployeeMutation,
  // useRestaurantServicesQuery,
  // useOrderHistoryQuery,
  // useOrderStatusSearchQuery,
} = apiSlice;
