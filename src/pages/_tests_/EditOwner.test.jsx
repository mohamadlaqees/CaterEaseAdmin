// src/pages/__tests__/EditOwner.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import EditOwner from "../EditOwner";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock the RTK Query hooks
const mockEditOwnerMutation = vi.fn();
const mockOwnerDetailsQuery = vi.fn();

vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useEditOwnerMutation: () => [mockEditOwnerMutation, { isLoading: false }],
    useOwnerDetailsQuery: (id) => mockOwnerDetailsQuery(id),
  };
});

const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

const renderComponent = (ownerId) => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/owners/${ownerId}/edit`]}>
        <Routes>
          <Route path="/owners/:ownerID/edit" element={<EditOwner />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("EditOwner Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state while fetching owner details", () => {
    mockOwnerDetailsQuery.mockReturnValue({ isFetching: true });
    renderComponent(1);
    expect(screen.getByText(/loading form.../i)).toBeInTheDocument();
  });

  it("populates the form with fetched owner data", async () => {
    const mockOwner = {
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "987654321",
        gender: "f",
      },
    };
    mockOwnerDetailsQuery.mockReturnValue({
      data: mockOwner,
      isFetching: false,
    });
    renderComponent(1);

    // Use `waitFor` to ensure the form's `reset` effect has run
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Jane Doe");
      expect(screen.getByLabelText(/email address/i)).toHaveValue(
        "jane@example.com"
      );
      expect(screen.getByLabelText(/phone number/i)).toHaveValue("987654321");
      expect(screen.getByRole("radio", { name: /female/i })).toBeChecked();
      expect(screen.getByLabelText(/new password/i)).toHaveValue("");
    });
  });

  it("calls the edit mutation with updated data on submit", async () => {
    const mockOwner = {
      user: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "987654321",
        gender: "f",
      },
    };
    mockOwnerDetailsQuery.mockReturnValue({
      data: mockOwner,
      isFetching: false,
    });
    mockEditOwnerMutation.mockResolvedValue({ message: "Update successful" });
    renderComponent(1);

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Smith");
    await userEvent.click(
      screen.getByRole("button", { name: /save changes/i })
    );

    await waitFor(() => {
      expect(mockEditOwnerMutation).toHaveBeenCalledWith({
        ownerID: "1",
        payload: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "987654321",
          gender: "f",
          // Password is not included because it was left blank
        },
      });
    });
  });
});
