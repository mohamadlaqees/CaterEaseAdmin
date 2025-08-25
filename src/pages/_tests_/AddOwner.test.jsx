// src/pages/__tests__/AddOwner.test.jsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AddOwner from "../AddOwner";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock the mutation
const mockAddOwnerMutation = vi.fn();
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useAddOwnerMutation: () => [mockAddOwnerMutation, { isLoading: false }],
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
        <AddOwner />
      </MemoryRouter>
    </Provider>
  );
};

describe("AddOwner Page", () => {
  it("renders all form fields and buttons", () => {
    renderComponent();
    expect(
      screen.getByRole("heading", { name: /add new owner/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /male/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create owner/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    renderComponent();
    await userEvent.click(
      screen.getByRole("button", { name: /create owner/i })
    );

    // Zod validation messages will appear. We check for one of them.
    // The exact message depends on your schema definition.
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it("submits the form with correct data when all fields are valid", async () => {
    mockAddOwnerMutation.mockResolvedValue({ message: "Success" });
    renderComponent();

    await userEvent.type(screen.getByLabelText(/full name/i), "Test User");
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "test@user.com"
    );
    await userEvent.type(screen.getByLabelText(/phone number/i), "1234567890");
    await userEvent.type(
      screen.getByLabelText(/password/i),
      "ValidPassword123"
    );
    await userEvent.click(screen.getByLabelText(/female/i));
    await userEvent.click(
      screen.getByRole("button", { name: /create owner/i })
    );

    expect(mockAddOwnerMutation).toHaveBeenCalledWith({
      payload: {
        role_id: 4,
        name: "Test User",
        email: "test@user.com",
        phone: "1234567890",
        password: "ValidPassword123",
        gender: "f",
      },
    });
  });
});
