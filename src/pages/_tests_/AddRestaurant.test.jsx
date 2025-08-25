// src/pages/__tests__/AddRestaurant.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AddRestaurant from "../AddRestaurant";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock hooks
const mockAddRestaurantMutation = vi.fn();
const mockOwnersQuery = vi.fn();

vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useAddRestaurantMutation: () => [
      mockAddRestaurantMutation,
      { isLoading: false },
    ],
    useOwnersQuery: () => mockOwnersQuery(),
  };
});

const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <AddRestaurant />
      </MemoryRouter>
    </Provider>
  );
};

describe("AddRestaurant Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful owners fetch
    mockOwnersQuery.mockReturnValue({
      data: { allOwner: [{ id: 1, name: "John Owner" }] },
    });
  });

  it("renders the form with all fields", () => {
    renderComponent();
    expect(
      screen.getByRole("heading", { name: /add restaurant/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/restaurant name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/owner/i)).toBeInTheDocument();
    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
  });

  it("populates the owner dropdown with fetched data", async () => {
    renderComponent();
    await userEvent.click(screen.getByRole("combobox", { name: /owner/i }));
    expect(await screen.findByText("John Owner")).toBeInTheDocument();
  });

  it("submits the form with correct data", async () => {
    mockAddRestaurantMutation.mockResolvedValue({ message: "Success" });
    renderComponent();

    await userEvent.type(
      screen.getByLabelText(/restaurant name/i),
      "The Grand Bistro"
    );
    await userEvent.type(screen.getByLabelText(/description/i), "Fine dining");
    await userEvent.click(screen.getByRole("combobox", { name: /owner/i }));
    await userEvent.click(await screen.findByText("John Owner"));

    await userEvent.click(
      screen.getByRole("button", { name: /create restaurant/i })
    );

    await waitFor(() => {
      expect(mockAddRestaurantMutation).toHaveBeenCalledWith({
        name: "The Grand Bistro",
        description: "Fine dining",
        owner_id: "1",
        photo: null, // Photo is null because we didn't upload one
      });
    });
  });
});
