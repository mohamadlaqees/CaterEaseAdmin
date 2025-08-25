import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import EditRestaurant from "../EditRestaurant";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock data
const mockRestaurant = {
  name: "The Golden Spoon",
  description: "A place of fine taste.",
  owner: { id: 2, name: "Chef Gusteau" },
  photo: "http://example.com/photo.jpg",
};

const mockOwners = {
  allOwner: [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Chef Gusteau" },
  ],
};

// Mock hooks
const mockUpdateRestaurantMutation = vi.fn();
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useRestaurantDetailsQuery: vi.fn(),
    useUpdateRestaurantMutation: () => [
      mockUpdateRestaurantMutation,
      { isLoading: false },
    ],
    useOwnersQuery: () => ({ data: mockOwners }),
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
      <MemoryRouter initialEntries={["/restaurants/1/edit-restaurant"]}>
        <Routes>
          <Route
            path="/restaurants/:restaurantID/edit-restaurant"
            element={<EditRestaurant />}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("EditRestaurant Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useRestaurantDetailsQuery.mockReturnValue({
      data: mockRestaurant,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it("shows a skeleton while fetching details", () => {
    useRestaurantDetailsQuery.mockReturnValue({
      isLoading: true,
      refetch: vi.fn(),
    });
    renderComponent();
    // Assuming your skeleton has a specific test-id
    expect(screen.getByTestId("edit-restaurant-skeleton")).toBeInTheDocument();
  });

  it("populates the form with fetched restaurant data", async () => {
    renderComponent();
    expect(
      await screen.findByDisplayValue("The Golden Spoon")
    ).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue("A place of fine taste.")
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /preview/i })).toHaveAttribute(
      "src",
      "http://example.com/photo.jpg"
    );
    // Check if the correct owner is selected in the dropdown
    expect(screen.getByText("Chef Gusteau")).toBeInTheDocument();
  });

  it("submits the form with updated data", async () => {
    mockUpdateRestaurantMutation.mockResolvedValue({ message: "Updated" });
    renderComponent();

    const nameInput = await screen.findByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "The Silver Fork");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i })
    );

    await waitFor(() => {
      expect(mockUpdateRestaurantMutation).toHaveBeenCalledWith({
        restaurantID: "1",
        body: {
          name: "The Silver Fork",
          description: "A place of fine taste.",
          owner_id: "2",
          photo: "http://example.com/photo.jpg", // Photo remains the same unless changed
        },
      });
    });
  });
});
