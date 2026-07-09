import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";

describe("app/error", () => {
  beforeEach(() => {
    // ErrorPage intentionally logs the error on mount — keep test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders bilingual error copy", () => {
    render(<ErrorPage error={new Error("boom")} reset={() => {}} />);

    expect(
      screen.getByRole("heading", { name: "Đã có lỗi xảy ra" })
    ).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Thử lại \/ Try again/ })
    ).toBeInTheDocument();
  });

  it("shows the error digest when present", () => {
    const error = Object.assign(new Error("boom"), { digest: "abc123" });
    render(<ErrorPage error={error} reset={() => {}} />);

    expect(screen.getByText(/abc123/)).toBeInTheDocument();
  });

  it("logs the error for diagnostics", () => {
    const error = new Error("boom");
    render(<ErrorPage error={error} reset={() => {}} />);

    expect(console.error).toHaveBeenCalledWith(error);
  });

  it("calls reset() when the retry button is pressed", async () => {
    const reset = vi.fn();
    const user = userEvent.setup();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);

    await user.click(screen.getByRole("button", { name: /Thử lại/ }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
