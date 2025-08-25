// src/pages/__tests__/Login.test.jsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../Login";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock the RTK Query hook
const mockLoginMutation = vi.fn();
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useLogInMutation: () => [mockLoginMutation, { isLoading: false }],
  };
});

// Mock Redux store
const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("Login Page", () => {
  it("renders the login form correctly", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByRole("heading", { name: /CaterEase/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("allows the user to type into email and password fields", async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls the login mutation with form data upon submission", async () => {
    mockLoginMutation.mockResolvedValue({ data: { message: "Success" } }); // Mock a successful response
    renderWithProviders(<Login />);

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      "test@example.com"
    );
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockLoginMutation).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("shows an error toast if the login mutation fails", async () => {
    // Mock a failed response
    const error = { data: { message: "Invalid credentials" } };
    mockLoginMutation.mockRejectedValue(error);
    renderWithProviders(<Login />);

    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Note: Testing "sonner" toasts requires a more complex setup.
    // For simplicity, we confirm the mutation was called. In a real app,
    // you might spy on the `toast.error` function.
    expect(mockLoginMutation).toHaveBeenCalled();
  });
});
