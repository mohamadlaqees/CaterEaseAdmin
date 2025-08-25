// src/pages/__tests__/Restaurants.test.jsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Restaurants from "../Restaurants";
import { apiSlice } from "../../store/apiSlice/apiSlice";
import restaurantSlice from "../../store/restaurantSlice";

// Mock data
const mockRestaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    owner: { name: "Mario" },
    city: "Mushroom Kingdom",
  },
  {
    id: 2,
    name: "Burger Barn",
    owner: { name: "Luigi" },
    city: "Delfino Plaza",
  },
];

// Mock hooks
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useRestaurantsQuery: vi.fn(),
    useDeleteRestaurantMutation: () => [vi.fn(), { isLoading: false }],
  };
});

import { useRestaurantsQuery } from "../../store/apiSlice/apiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    restaurant: restaurantSlice.reducer,
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Restaurants />
      </MemoryRouter>
    </Provider>
  );
};

describe("Restaurants List Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows a skeleton grid while loading", () => {
    useRestaurantsQuery.mockReturnValue({ isLoading: true });
    renderComponent();
    expect(screen.getByTestId("restaurant-grid-skeleton")).toBeInTheDocument();
  });

  it("shows an empty state message when there are no restaurants", () => {
    useRestaurantsQuery.mockReturnValue({ data: [], isLoading: false });
    renderComponent();
    expect(
      screen.getByRole("heading", { name: /no restaurants found/i })
    ).toBeInTheDocument();
  });

  it("renders a grid of restaurant cards with data", () => {
    useRestaurantsQuery.mockReturnValue({
      data: mockRestaurants,
      isLoading: false,
    });
    renderComponent();
    expect(
      screen.getByRole("heading", { name: "Pizza Palace" })
    ).toBeInTheDocument();
    expect(screen.getByText("Owner: Mario")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Burger Barn" })
    ).toBeInTheDocument();
    expect(screen.getByText("Owner: Luigi")).toBeInTheDocument();
  });

  it("has links to view details and edit for each card", () => {
    useRestaurantsQuery.mockReturnValue({
      data: mockRestaurants,
      isLoading: false,
    });
    renderComponent();
    const viewLinks = screen.getAllByRole("link", { name: /view details/i });
    const editLinks = screen.getAllByRole("link", { name: /edit restaurant/i });

    expect(viewLinks[0]).toHaveAttribute("href", "/restaurants/1");
    expect(editLinks[0]).toHaveAttribute(
      "href",
      "/restaurants/1/edit-restaurant"
    );
  });
});
