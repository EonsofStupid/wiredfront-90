
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LogsTabs } from "../LogsTabs";

describe("LogsTabs", () => {
  it("renders all tab options", () => {
    const mockSetActiveTab = vi.fn();
    render(<LogsTabs activeTab="all" setActiveTab={mockSetActiveTab} />);
    
    expect(screen.getByRole("tab", { name: "All Logs" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Info" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Warnings" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Errors" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Debug" })).toBeInTheDocument();
  });

  it("calls setActiveTab when a tab is clicked", () => {
    const mockSetActiveTab = vi.fn();
    render(<LogsTabs activeTab="all" setActiveTab={mockSetActiveTab} />);
    
    fireEvent.click(screen.getByRole("tab", { name: "Info" }));
    expect(mockSetActiveTab).toHaveBeenCalledWith("info");
    
    fireEvent.click(screen.getByRole("tab", { name: "Errors" }));
    expect(mockSetActiveTab).toHaveBeenCalledWith("error");
  });

  it("applies the active state to the selected tab", () => {
    const mockSetActiveTab = vi.fn();
    render(<LogsTabs activeTab="warn" setActiveTab={mockSetActiveTab} />);
    
    const warningsTab = screen.getByRole("tab", { name: "Warnings" });
    expect(warningsTab).toHaveAttribute("data-state", "active");
    
    const infoTab = screen.getByRole("tab", { name: "Info" });
    expect(infoTab).toHaveAttribute("data-state", "inactive");
  });
});
