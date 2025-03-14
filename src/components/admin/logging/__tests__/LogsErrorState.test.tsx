
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LogsErrorState } from "../LogsErrorState";

describe("LogsErrorState", () => {
  it("renders the error state with the provided error message", () => {
    const errorMessage = "Test error message";
    render(<LogsErrorState error={errorMessage} />);
    
    expect(screen.getByText("Error Loading Logs")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByTestId("logs-error-icon")).toBeInTheDocument();
  });
});
