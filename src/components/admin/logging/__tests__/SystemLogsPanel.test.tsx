
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SystemLogsPanel } from "../SystemLogsPanel";
import { mockUseSystemLogs, createMockSystemLogs } from "./mocks/mockSystemLogs";

// Mock the useSystemLogs hook
vi.mock("../useSystemLogs", () => ({
  useSystemLogs: () => mockUseSystemLogs()
}));

describe("SystemLogsPanel", () => {
  beforeEach(() => {
    mockUseSystemLogs.mockImplementation(createMockSystemLogs);
  });

  it("renders loading state when isLoading is true", () => {
    mockUseSystemLogs.mockImplementation(() => ({
      ...createMockSystemLogs(),
      isLoading: true
    }));
    
    render(<SystemLogsPanel />);
    expect(screen.getByTestId("logs-loading-spinner")).toBeInTheDocument();
  });

  it("renders error state when error exists", () => {
    mockUseSystemLogs.mockImplementation(() => ({
      ...createMockSystemLogs(),
      error: "Failed to load logs"
    }));
    
    render(<SystemLogsPanel />);
    expect(screen.getByText("Error Loading Logs")).toBeInTheDocument();
    expect(screen.getByText("Failed to load logs")).toBeInTheDocument();
  });

  it("renders empty state when no logs match filters", () => {
    mockUseSystemLogs.mockImplementation(() => ({
      ...createMockSystemLogs(),
      filteredLogs: [],
      logs: [{ id: "1", message: "test" }]
    }));
    
    render(<SystemLogsPanel />);
    expect(screen.getByText("No logs found")).toBeInTheDocument();
    expect(screen.getByText("No logs match your current filters")).toBeInTheDocument();
  });

  it("renders empty state when no logs exist", () => {
    mockUseSystemLogs.mockImplementation(() => ({
      ...createMockSystemLogs(),
      filteredLogs: [],
      logs: []
    }));
    
    render(<SystemLogsPanel />);
    expect(screen.getByText("No logs found")).toBeInTheDocument();
    expect(screen.getByText("No system logs have been recorded yet")).toBeInTheDocument();
  });

  it("renders logs table when logs exist", () => {
    render(<SystemLogsPanel />);
    
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Level")).toBeInTheDocument();
    expect(screen.getByText("Source")).toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByText("User logged in")).toBeInTheDocument();
  });

  it("renders filter and tab components", () => {
    render(<SystemLogsPanel />);
    
    expect(screen.getByPlaceholderText("Search logs...")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All Logs" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Info" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Warnings" })).toBeInTheDocument();
  });
});
