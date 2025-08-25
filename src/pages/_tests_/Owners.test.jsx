import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AddRestaurant from "../AddRestaurant";
import { apiSlice } from "../../store/apiSlice/apiSlice";

// Mock dependencies
const mockAddRestaurantMutation = vi.fn();
vi.mock("../../store/apiSlice/apiSlice", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useAddRestaurantMutation: () => [
      mockAddRestaurantMutation,
      { isLoading: false },
    ],
    useOwnersQuery: () => ({
      data: { allOwner: [{ id: 1, name: "John Doe" }] },
    }),
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

  it("allows user to fill out the form and select an owner", async () => {
    renderComponent();
    await userEvent.type(
      screen.getByLabelText(/restaurant name/i),
      "The Grand Bistro"
    );
    await userEvent.type(
      screen.getByLabelText(/description/i),
      "Fine dining experience"
    );

    // Open the select dropdown and choose an owner
    await userEvent.click(screen.getByRole("combobox", { name: /owner/i }));
    await userEvent.click(await screen.findByText("John Doe"));

    expect(screen.getByLabelText(/restaurant name/i)).toHaveValue(
      "The Grand Bistro"
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("simulates file upload and shows a preview", async () => {
    renderComponent();
    const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
    const fileInput = screen.getByLabelText(/click to upload/i);

    // userEvent.upload is the standard way to handle file inputs
    await userEvent.upload(fileInput, file);

    // Check for the preview image
    const previewImage = await screen.findByRole("img", {
      name: /restaurant preview/i,
    });
    expect(previewImage).toBeInTheDocument();
    expect(previewImage.src).to.contain("data:image/png;base64,");
  });

  it("submits the form with the correct data", async () => {
    mockAddRestaurantMutation.mockResolvedValue({ message: "Success" });
    renderComponent();

    await userEvent.type(
      screen.getByLabelText(/restaurant name/i),
      "The Grand Bistro"
    );
    await userEvent.type(
      screen.getByLabelText(/description/i),
      "Fine dining experience"
    );
    await userEvent.click(screen.getByRole("combobox", { name: /owner/i }));
    await userEvent.click(await screen.findByText("John Doe"));

    await userEvent.click(
      screen.getByRole("button", { name: /create restaurant/i })
    );

    expect(mockAddRestaurantMutation).toHaveBeenCalledWith({
      name: "The Grand Bistro",
      description: "Fine dining experience",
      owner_id: "1", // Zod might convert it to a string
      photo: null, // No photo was uploaded in this test
    });
  });
});
