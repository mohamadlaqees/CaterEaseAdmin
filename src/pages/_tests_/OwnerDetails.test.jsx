// src/pages/__tests__/OwnerDetails.test.jsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import OwnerDetails from "../OwnerDetails";
import { apiSlice } from "../../store/apiSlice/apiSlice";
import ownerSlice from "../../store/ownerSlice"; // Import the slice

// Mock data
const mockDetails = {
  user: {
    name: "John Owner",
    email: "john@owner.com",
    phone: "555-1234",
    status: "active",
    role: { name: "Restaurant Owner" },
    created_at: "2025-08-25T12:00:00.000Z",
    email_verified_at: "2025-08-25T12:00:00.000Z",
  },
  restaurant: {
    id: 101,
    name: "The Tasty Place",
    city: { name: "Foodville" },
    branches: [{ description: "Downtown Branch" }],
    photo: "/tasty-place.jpg",
  },
};

// Mock hooks
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useOwnerDetailsQuery: vi.fn(),
    useDeleteOwnerMutation: () => [vi.fn(), { isLoading: false }],
  };
});

import { useOwnerDetailsQuery } from "../../store/apiSlice/apiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    owner: ownerSlice.reducer, // Add the slice reducer
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/owners/1"]}>
        <Routes>
          <Route path="/owners/:ownerID" element={<OwnerDetails />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("OwnerDetails Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useOwnerDetailsQuery.mockReturnValue({
      data: mockDetails,
      isLoading: false,
    });
  });

  it("displays all owner and restaurant details correctly", () => {
    renderComponent();
    // Owner details
    expect(
      screen.getByRole("heading", { name: "John Owner" })
    ).toBeInTheDocument();
    expect(screen.getByText("john@owner.com")).toBeInTheDocument();
    expect(screen.getByText("555-1234")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    // Restaurant details
    expect(screen.getByText("The Tasty Place")).toBeInTheDocument();
    expect(screen.getByText("Foodville")).toBeInTheDocument();
    expect(screen.getByText("Downtown Branch")).toBeInTheDocument();
  });

  it("opens the options menu and shows Edit and Delete actions", async () => {
    renderComponent();
    const menuButton = screen.getByRole("button", { name: /options menu/i });
    await userEvent.click(menuButton);

    expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("renders a message if no restaurant is assigned", () => {
    const noRestaurantDetails = { ...mockDetails, restaurant: {} };
    useOwnerDetailsQuery.mockReturnValue({
      data: noRestaurantDetails,
      isLoading: false,
    });
    renderComponent();
    expect(
      screen.getByText(/not currently assigned to a branch/i)
    ).toBeInTheDocument();
  });
});
