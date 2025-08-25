// src/components/__tests__/TableComponent.test.jsx

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import TableComponent from "../TableComponent";

const mockHeader = [
  { name: "ID", key: "id" },
  { name: "Name", key: "name" },
];

const mockBody = [
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" },
];

describe("TableComponent", () => {
  it("renders headers and body data correctly", () => {
    render(
      <MemoryRouter>
        <TableComponent
          tableHeader={mockHeader}
          tableBody={mockBody}
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("columnheader", { name: /id/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /name/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /item one/i })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /item two/i })).toBeInTheDocument();
  });

  it("renders a loading spinner when isLoading is true", () => {
    render(
      <MemoryRouter>
        <TableComponent
          tableHeader={mockHeader}
          tableBody={[]}
          isLoading={true}
        />
      </MemoryRouter>
    );

    // The loader has no accessible role, so we check for its presence via test-id or class
    // Assuming the Loader2 component has a class 'animate-spin'
    const loader = document.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it('renders "No results found" when body is empty and not loading', () => {
    render(
      <MemoryRouter>
        <TableComponent
          tableHeader={mockHeader}
          tableBody={[]}
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it("renders a link for the name field if a direction is provided", () => {
    render(
      <MemoryRouter>
        <TableComponent
          tableHeader={mockHeader}
          tableBody={mockBody}
          isLoading={false}
          direction="items"
        />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /item one/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/items/1");
  });
});
