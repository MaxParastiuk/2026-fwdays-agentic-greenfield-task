/** @jest-environment jsdom */

import { act, fireEvent, render, screen } from "@testing-library/react";

import { CopyButton } from "./copy-button";

describe("CopyButton", () => {
  const writeText = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    writeText.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("copies the exact letter text on click", () => {
    render(<CopyButton text="Dear hiring manager," />);

    fireEvent.click(
      screen.getByRole("button", { name: "Copy to clipboard" }),
    );

    expect(writeText).toHaveBeenCalledWith("Dear hiring manager,");
  });

  it('shows "Copied" for 2 seconds then resets', () => {
    render(<CopyButton text="Hello" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Copy to clipboard" }),
    );
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(
      screen.getByRole("button", { name: "Copy to clipboard" }),
    ).toBeInTheDocument();
  });

  it("still shows copied feedback when clipboard write fails", () => {
    writeText.mockImplementation(() => {
      throw new Error("denied");
    });

    render(<CopyButton text="Hello" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Copy to clipboard" }),
    );

    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("clears the reset timer on unmount", () => {
    const { unmount } = render(<CopyButton text="Hello" />);

    fireEvent.click(
      screen.getByRole("button", { name: "Copy to clipboard" }),
    );
    unmount();

    expect(() => {
      act(() => {
        jest.advanceTimersByTime(2000);
      });
    }).not.toThrow();
  });
});
