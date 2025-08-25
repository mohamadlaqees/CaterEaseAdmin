// src/pages/__tests__/Reviews.test.jsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Reviews from "../Reviews";
import { apiSlice } from "../../store/apiSlice/apiSlice";
import reportSlice from "../../store/reportSlice";

// Mock data
const mockComplaints = [
  {
    id: 1,
    score: 5,
    message: "Excellent service!",
    status: "under_review",
    user: { name: "Happy Customer" },
    created_at: "2025-08-25T00:00:00Z",
  },
  {
    id: 2,
    score: 1,
    message: "Very slow.",
    status: "under_review",
    user: { name: "Unhappy Customer" },
    created_at: "2025-08-24T00:00:00Z",
  },
];

// Mock hooks
const mockChangeStatusMutation = vi.fn();
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useComplaintsQuery: vi.fn(),
    useChangeReviewsStatusMutation: () => [
      mockChangeStatusMutation,
      { isLoading: false },
    ],
    useDeleteReviewMutation: () => [vi.fn(), { isLoading: false }],
  };
});

import { useComplaintsQuery } from "../../store/apiSlice/apiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    report: reportSlice.reducer,
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

const renderComponent = () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Reviews />
      </MemoryRouter>
    </Provider>
  );
};

describe("Reviews Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useComplaintsQuery.mockReturnValue({
      data: mockComplaints,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it("renders a list of reviews with user information", () => {
    renderComponent();
    expect(
      screen.getByRole("heading", { name: /happy customer/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Excellent service!")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /unhappy customer/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Very slow.")).toBeInTheDocument();
  });

  it("calls the change status mutation when a new status is selected", async () => {
    mockChangeStatusMutation.mockResolvedValue({ message: "Status updated" });
    renderComponent();

    // Find the first status dropdown
    const statusDropdowns = screen.getAllByRole("combobox");
    await userEvent.click(statusDropdowns[0]);

    // Click the 'Resolved' option
    await userEvent.click(await screen.findByText("Resolved"));

    expect(mockChangeStatusMutation).toHaveBeenCalledWith({
      id: 1,
      status: "resolved", // Note: your code has a typo 'resloved', I've corrected it here
    });
  });
});
