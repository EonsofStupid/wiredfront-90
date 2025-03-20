import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LogsHeader } from "../LogsHeader";
describe("LogsHeader", () => {
    it("renders the header with correct title and description", () => {
        render(_jsx(LogsHeader, {}));
        expect(screen.getByText("System Logs")).toBeInTheDocument();
        expect(screen.getByText("View and manage system logs from across the application")).toBeInTheDocument();
        expect(screen.getByTestId("logs-header-icon")).toBeInTheDocument();
    });
});
