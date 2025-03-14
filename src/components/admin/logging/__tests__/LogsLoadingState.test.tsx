
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LogsLoadingState } from "../LogsLoadingState";

describe("LogsLoadingState", () => {
  it("renders the loading state with spinner and text", () => {
    render(<LogsLoadingState />);
    
    expect(screen.getByTestId("logs-loading-spinner")).toBeInTheDocument();
    expect(screen.getByText("Loading logs...")).toBeInTheDocument();
  });
});
