import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Layout from "./layout/Layout.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import ProtectRoute from "./components/protectRoute.jsx";
import Owners from "./pages/Owners.jsx";
import AddOwner from "./pages/AddOwner.jsx";
import EditOwner from "./pages/EditOwner.jsx";
import EditRestaurant from "./pages/EditRestaurant.jsx";
import RestaurantDetails from "./pages/RestaurantDetails.jsx";
import AddRestaurant from "./pages/AddRestaurant.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import OwnerDetails from "./pages/OwnerDetails.jsx";
import FeedbackPage from "./pages/Feedback.jsx";

const routes = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectRoute>
        <Layout />
      </ProtectRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "Restaurants",
        element: <Restaurants />,
      },
      {
        path: "restaurants/edit/:restaurantID",
        element: <EditRestaurant />,
      },
      {
        path: "restaurants/:restaurantID",
        element: <RestaurantDetails />,
      },
      {
        path: "restaurants/:restaurantID/edit-restaurant",
        element: <EditRestaurant />,
      },
      {
        path: "restaurants/add-restaurant",
        element: <AddRestaurant />,
      },
      {
        path: "owners",
        element: <Owners />,
        children: [
          {
            index: true,
            element: <Owners />,
          },
          {
            path: "add-owner",
            element: <AddOwner />,
          },
        ],
      },
      {
        path: "owners/:ownerID",
        element: <OwnerDetails />,
        children: [
          {
            index: true,
            element: <OwnerDetails />,
          },
          {
            path: "edit-owner",
            element: <EditOwner />,
          },
        ],
      },
      {
        path: "feedback",
        element: <FeedbackPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
