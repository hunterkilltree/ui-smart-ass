import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount rendered components between tests (auto-cleanup needs test globals,
// which we keep disabled).
afterEach(() => {
  cleanup();
});
