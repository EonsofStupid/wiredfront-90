import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LogsTable } from "../LogsTable";
describe("LogsTable", () => {
    const mockLogs = [
        {
            id: "1",
            timestamp: "2023-01-01T12:00:00Z",
            level: "info",
            source: "auth",
            message: "User logged in",
            metadata: { userId: "123" },
            user_id: "user1"
        },
        {
            id: "2",
            timestamp: "2023-01-01T12:05:00Z",
            level: "error",
            source: "api",
            message: "API request failed",
            metadata: { status: 500 },
            user_id: "user1"
        }
    ];
    it("renders the table with headers", () => {
        render(_jsx(LogsTable, { logs: mockLogs, expandedLogId: null, toggleExpandLog: vi.fn() }));
        expect(screen.getByText("Time")).toBeInTheDocument();
        expect(screen.getByText("Level")).toBeInTheDocument();
        expect(screen.getByText("Source")).toBeInTheDocument();
        expect(screen.getByText("Message")).toBeInTheDocument();
    });
    it("renders log items for each log", () => {
        render(_jsx(LogsTable, { logs: mockLogs, expandedLogId: null, toggleExpandLog: vi.fn() }));
        expect(screen.getByText("User logged in")).toBeInTheDocument();
        expect(screen.getByText("API request failed")).toBeInTheDocument();
        expect(screen.getAllByTestId("log-item-row")).toHaveLength(2);
    });
    it("expands the correct log when toggle is called", () => {
        const mockToggleExpandLog = vi.fn();
        render(_jsx(LogsTable, { logs: mockLogs, expandedLogId: "1", toggleExpandLog: mockToggleExpandLog }));
        const logRows = screen.getAllByTestId("log-item-row");
        fireEvent.click(logRows[1]); // Click the second log
        expect(mockToggleExpandLog).toHaveBeenCalledWith("2");
    });
});
