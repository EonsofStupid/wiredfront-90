
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LogItem } from "../LogItem";

describe("LogItem", () => {
  const mockLog = {
    id: "1",
    timestamp: "2023-01-01T12:00:00Z",
    level: "info",
    source: "auth",
    message: "User logged in",
    metadata: { userId: "123", browser: "Chrome" }
  };

  it("renders log information correctly", () => {
    render(<LogItem log={mockLog} isExpanded={false} onToggleExpand={vi.fn()} />);
    
    expect(screen.getByText("2023-01-01 12:00:00")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("auth")).toBeInTheDocument();
    expect(screen.getByText("User logged in")).toBeInTheDocument();
  });

  it("shows metadata when expanded", () => {
    render(<LogItem log={mockLog} isExpanded={true} onToggleExpand={vi.fn()} />);
    
    const metadataText = screen.getByText(/"userId": "123"/);
    expect(metadataText).toBeInTheDocument();
    
    const browserText = screen.getByText(/"browser": "Chrome"/);
    expect(browserText).toBeInTheDocument();
  });

  it("calls toggle function when clicked", () => {
    const mockToggle = vi.fn();
    render(<LogItem log={mockLog} isExpanded={false} onToggleExpand={mockToggle} />);
    
    fireEvent.click(screen.getByText("User logged in"));
    expect(mockToggle).toHaveBeenCalled();
  });

  it("applies different icon and badge color based on log level", () => {
    const errorLog = {
      ...mockLog,
      level: "error",
      message: "Failed login attempt"
    };
    
    const { rerender } = render(
      <LogItem log={mockLog} isExpanded={false} onToggleExpand={vi.fn()} />
    );
    
    // Info level should show blue icon
    const infoIcon = screen.getByTestId("log-level-icon");
    expect(infoIcon).toHaveClass("text-blue-500");
    
    // Rerender with error log
    rerender(<LogItem log={errorLog} isExpanded={false} onToggleExpand={vi.fn()} />);
    
    // Error level should show red icon
    const errorIcon = screen.getByTestId("log-level-icon");
    expect(errorIcon).toHaveClass("text-red-500");
  });
});
