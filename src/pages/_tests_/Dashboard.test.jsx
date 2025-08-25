// src/pages/__tests__/AdminDashboard.test.jsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AdminDashboard from "../AdminDashboard";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock all the necessary hooks
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useStatisticsQuery: vi.fn(),
    useRestaurantsPerformanceQuery: vi.fn(),
    useTotalSellingItemsQuery: vi.fn(),
    useRestaurantsQuery: vi.fn(),
    useRestaurantStatisticsQuery: vi.fn(),
  };
});

// Import the mocked hooks after mocking the module
import {
  useStatisticsQuery,
  useRestaurantsPerformanceQuery,
  useTotalSellingItemsQuery,
  useRestaurantsQuery,
  useRestaurantStatisticsQuery,
} from "../../store/apiSlice/apiSlice";
import { beforeEach } from "node:test";

const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

const renderComponent = () => {
  render(
    <Provider store={store}>
      <AdminDashboard />
    </Provider>
  );
};

describe("AdminDashboard", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows the skeleton loader when data is loading", () => {
    useStatisticsQuery.mockReturnValue({ isLoading: true });
    useRestaurantsPerformanceQuery.mockReturnValue({ isLoading: true });
    useTotalSellingItemsQuery.mockReturnValue({ isLoading: true });
    useRestaurantsQuery.mockReturnValue({ isLoading: true });
    useRestaurantStatisticsQuery.mockReturnValue({ isLoading: true });

    renderComponent();
    // Assuming AdminashboardSkeleton has a test-id or a unique role
    expect(screen.getByTestId("admin-dashboard-skeleton")).toBeInTheDocument();
  });

  it("shows an error message if any query fails", () => {
    useStatisticsQuery.mockReturnValue({ isError: true });
    useRestaurantsPerformanceQuery.mockReturnValue({ data: {} });
    useTotalSellingItemsQuery.mockReturnValue({ data: {} });
    useRestaurantsQuery.mockReturnValue({ data: [] });
    useRestaurantStatisticsQuery.mockReturnValue({ data: {} });

    renderComponent();
    expect(screen.getByText(/error fetching statistics/i)).toBeInTheDocument();
  });

  it("renders the dashboard with system-wide data successfully", () => {
    // Provide mock successful data
    useStatisticsQuery.mockReturnValue({
      data: {
        total_revenue: 50000,
        total_orders: 1200,
        activeRestaurants: 10,
        averageSatisfaction: 4.5,
      },
      isLoading: false,
    });
    useRestaurantsPerformanceQuery.mockReturnValue({
      data: {
        data: [
          { RestaurantName: "Good Food", TotalRevenue: 5000, TotalOrders: 100 },
        ],
      },
      isLoading: false,
    });
    useTotalSellingItemsQuery.mockReturnValue({
      data: {
        data: [{ PackageName: "Burger", TotalOrders: 50, TotalRevenue: 500 }],
      },
      isLoading: false,
    });
    useRestaurantsQuery.mockReturnValue({
      data: [{ id: 1, name: "Good Food" }],
      isLoading: false,
    });
    useRestaurantStatisticsQuery.mockReturnValue({ isLoading: false });

    renderComponent();

    expect(
      screen.getByRole("heading", { name: /admin dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/sar 50000/i)).toBeInTheDocument();
    expect(screen.getByText(/1200/i)).toBeInTheDocument();
    expect(
      screen.getByText(/top restaurants performance/i)
    ).toBeInTheDocument();
  });
});
