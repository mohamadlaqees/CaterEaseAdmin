// src/components/__tests__/HeaderBar.test.jsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import HeaderBar from "../HeaderBar";
import sidebarSlice, { openSidebar } from "../../store/sidebarSlice";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock the logout mutation
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useLogOutMutation: () => [vi.fn(), { isLoading: false }],
  };
});

// Create a mock store with a spy on dispatch
const mockDispatch = vi.fn();
vi.mock("react-redux", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useDispatch: () => mockDispatch,
  };
});

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
});

describe("HeaderBar", () => {
  it("renders user info and notification bell", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeaderBar />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /notifications/i })
    ).toBeInTheDocument(); // Assuming you add an aria-label
  });

  it("dispatches openSidebar action when menu icon is clicked", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HeaderBar />
        </MemoryRouter>
      </Provider>
    );
    const menuIcon = screen.getByTestId("sidebar-menu-button"); // Add data-testid="sidebar-menu-button" to your Menu icon
    await userEvent.click(menuIcon);
    expect(mockDispatch).toHaveBeenCalledWith(
      openSidebar({ sidebarOpened: true })
    ); // Or false depending on initial state
  });
});
