// src/components/__tests__/LeftSideBar.test.jsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import LeftSideBar from "../LeftSideBar";
import sidebarSlice from "../../store/sidebarSlice";

const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
  },
});

describe("LeftSideBar", () => {
  it("renders all navigation links", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LeftSideBar />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByRole("link", { name: /dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /restaurants/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /owners/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /reviews/i })).toBeInTheDocument();
  });

  it("applies an active class to the current route", () => {
    render(
      <Provider store={store}>
        {/* Start the route at /owners */}
        <MemoryRouter initialEntries={["/owners"]}>
          <LeftSideBar />
        </MemoryRouter>
      </Provider>
    );
    const ownersLink = screen.getByRole("link", { name: /owners/i });
    // Check for a class that indicates it's active. This depends on your NavLink className logic.
    // For example, if active links get a 'bg-(--primary)' class:
    expect(ownersLink).toHaveClass("bg-(--primary)");
  });
});
