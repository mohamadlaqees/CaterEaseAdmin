// src/pages/__tests__/RestaurantDetails.test.jsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RestaurantDetails from "../RestaurantDetails";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock data
const mockRestaurant = {
  name: "The Savory Spot",
  description: "Delicious food for everyone.",
  created_at: "2025-08-25T10:00:00.000Z",
  owner: {
    name: "Jane Restaurateur",
    phone: "555-5678",
    email: "jane@savory.com",
  },
  photo: "/savory-spot.jpg",
};

// Mock hooks
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useRestaurantDetailsQuery: vi.fn(),
  };
});

import { useRestaurantDetailsQuery } from "../../store/apiSlice/apiSlice";

const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/restaurants/1"]}>
        <Routes>
          <Route
            path="/restaurants/:restaurantID"
            element={<RestaurantDetails />}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("RestaurantDetails Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useRestaurantDetailsQuery.mockReturnValue({
      data: mockRestaurant,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it("shows a skeleton while loading", () => {
    useRestaurantDetailsQuery.mockReturnValue({
      isLoading: true,
      refetch: vi.fn(),
    });
    renderComponent();
    expect(
      screen.getByTestId("restaurant-details-skeleton")
    ).toBeInTheDocument();
  });

  it("renders all restaurant and owner details correctly", () => {
    renderComponent();
    // Restaurant info
    expect(
      screen.getByRole("heading", { name: /restaurant details/i })
    ).toBeInTheDocument();
    expect(screen.getByText("The Savory Spot")).toBeInTheDocument();
    expect(
      screen.getByText("Delicious food for everyone.")
    ).toBeInTheDocument();
    // Owner info
    expect(screen.getByText("Jane Restaurateur")).toBeInTheDocument();
    expect(screen.getByText("555-5678")).toBeInTheDocument();
    expect(screen.getByText("jane@savory.com")).toBeInTheDocument();
    // Photo
    expect(
      screen.getByRole("img", { name: "The Savory Spot" })
    ).toBeInTheDocument();
  });
});
