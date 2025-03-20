import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LogsFilterBar } from "../LogsFilterBar";
describe("LogsFilterBar", () => {
    const defaultProps = {
        searchQuery: "",
        setSearchQuery: vi.fn(),
        sourceFilter: null,
        setSourceFilter: vi.fn(),
        uniqueSources: ["api", "auth", "database"],
        sortDirection: "desc",
        toggleSortDirection: vi.fn(),
        fetchLogs: vi.fn(),
        downloadLogs: vi.fn(),
        handleClearLogs: vi.fn(),
        isLoading: false,
        filteredLogs: [{ id: "1", message: "test" }],
        logs: [{ id: "1", message: "test" }]
    };
    it("renders the search input", () => {
        render(_jsx(LogsFilterBar, { ...defaultProps }));
        expect(screen.getByPlaceholderText("Search logs...")).toBeInTheDocument();
    });
    it("updates search query when typing in search input", () => {
        const setSearchQuery = vi.fn();
        render(_jsx(LogsFilterBar, { ...defaultProps, setSearchQuery: setSearchQuery }));
        const searchInput = screen.getByPlaceholderText("Search logs...");
        fireEvent.change(searchInput, { target: { value: "error" } });
        expect(setSearchQuery).toHaveBeenCalledWith("error");
    });
    it("disables download button when no logs are filtered", () => {
        render(_jsx(LogsFilterBar, { ...defaultProps, filteredLogs: [] }));
        const downloadButton = screen.getByTitle("Download logs");
        expect(downloadButton).toBeDisabled();
    });
    it("disables clear button when no logs exist", () => {
        render(_jsx(LogsFilterBar, { ...defaultProps, logs: [] }));
        const clearButton = screen.getByTitle("Clear all logs");
        expect(clearButton).toBeDisabled();
    });
    it("calls appropriate functions when buttons are clicked", () => {
        const mockFetchLogs = vi.fn();
        const mockDownloadLogs = vi.fn();
        const mockHandleClearLogs = vi.fn();
        const mockToggleSortDirection = vi.fn();
        render(_jsx(LogsFilterBar, { ...defaultProps, fetchLogs: mockFetchLogs, downloadLogs: mockDownloadLogs, handleClearLogs: mockHandleClearLogs, toggleSortDirection: mockToggleSortDirection }));
        fireEvent.click(screen.getByTitle("Sort newest first"));
        expect(mockToggleSortDirection).toHaveBeenCalled();
        fireEvent.click(screen.getByTitle("Refresh logs"));
        expect(mockFetchLogs).toHaveBeenCalled();
        fireEvent.click(screen.getByTitle("Download logs"));
        expect(mockDownloadLogs).toHaveBeenCalled();
        fireEvent.click(screen.getByTitle("Clear all logs"));
        expect(mockHandleClearLogs).toHaveBeenCalled();
    });
});
