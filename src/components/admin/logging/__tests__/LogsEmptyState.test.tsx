
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LogsEmptyState } from "../LogsEmptyState";

describe("LogsEmptyState", () => {
  it("shows correct message when no logs exist", () => {
    render(<LogsEmptyState logsExist={false} />);
    
    expect(screen.getByText("No logs found")).toBeInTheDocument();
    expect(screen.getByText("No system logs have been recorded yet")).toBeInTheDocument();
    expect(screen.getByTestId("logs-empty-icon")).toBeInTheDocument();
  });

  it("shows correct message when logs exist but are filtered out", () => {
    render(<LogsEmptyState logsExist={true} />);
    
    expect(screen.getByText("No logs found")).toBeInTheDocument();
    expect(screen.getByText("No logs match your current filters")).toBeInTheDocument();
    expect(screen.getByTestId("logs-empty-icon")).toBeInTheDocument();
  });
});
