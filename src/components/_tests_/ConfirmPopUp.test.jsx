// src/components/__tests__/ConfirmPopUp.test.jsx

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ConfirmPopUp from "../ConfirmPopUp";

describe("ConfirmPopUp", () => {
  it("renders the content and buttons correctly", () => {
    render(
      <ConfirmPopUp
        content="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
        loading={false}
      />
    );

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmPopUp
        content="Delete this?"
        onConfirm={handleConfirm}
        onCancel={() => {}}
        loading={false}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /confirm/i }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the cancel button is clicked", async () => {
    const handleCancel = vi.fn();
    render(
      <ConfirmPopUp
        content="Delete this?"
        onConfirm={() => {}}
        onCancel={handleCancel}
        loading={false}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("shows loading state on the confirm button", () => {
    render(
      <ConfirmPopUp
        content="Delete this?"
        onConfirm={() => {}}
        onCancel={() => {}}
        loading={true}
      />
    );

    const confirmButton = screen.getByRole("button", {
      name: /confirming.../i,
    });
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });
});
