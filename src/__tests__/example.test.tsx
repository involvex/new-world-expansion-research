// import { App } from './../../App';
import { describe, it, expect } from "vitest";
import { App } from "../../App";
// import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { debug } from "vitest-preview";

describe("App test", () => {
  it("should pass", () => {
    debug();
    expect(true).toBe(true);
  });
  // Test that the App component renders without crashing and displays key elements
  it("renders the main application title", () => {
    render(<App />);
    // Check for the main title from the Header component
    expect(screen.getByText("Aeternum Research Tool")).toBeDefined();
  });
});
