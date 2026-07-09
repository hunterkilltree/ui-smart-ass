import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";

describe("app/not-found", () => {
  it("renders branded, bilingual 404 copy", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Không tìm thấy trang" })
    ).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("links back to home and to the dashboard", () => {
    render(<NotFound />);

    const home = screen.getByRole("link", { name: /Về trang chính/ });
    const dashboard = screen.getByRole("link", { name: /Bảng điều khiển/ });

    expect(home).toHaveAttribute("href", "/");
    expect(dashboard).toHaveAttribute("href", "/dashboard");
  });
});
