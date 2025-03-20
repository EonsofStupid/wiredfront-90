import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSystemLogs } from "../useSystemLogs";
// Mock the Supabase client
vi.mock("@/integrations/supabase/client", () => ({
    supabase: {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        not: vi.fn().mockReturnThis()
    }
}));
describe("useSystemLogs", () => {
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
    beforeEach(() => {
        vi.resetAllMocks();
        // Mock window.confirm for clear logs function
        global.confirm = vi.fn().mockImplementation(() => true);
        // Mock window.URL methods for download function
        global.URL.createObjectURL = vi.fn();
        global.URL.revokeObjectURL = vi.fn();
        // Mock DOM methods for download
        document.body.appendChild = vi.fn();
        document.body.removeChild = vi.fn();
        global.Blob = vi.fn().mockImplementation(() => ({}));
        // Mock createElement and click
        const mockAnchor = {
            href: "",
            download: "",
            click: vi.fn()
        };
        document.createElement = vi.fn().mockImplementation(() => mockAnchor);
    });
    it("should initialize with correct default values", () => {
        const { result } = renderHook(() => useSystemLogs());
        expect(result.current.logs).toEqual([]);
        expect(result.current.filteredLogs).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.activeTab).toBe("all");
        expect(result.current.searchQuery).toBe("");
        expect(result.current.sourceFilter).toBe(null);
        expect(result.current.uniqueSources).toEqual([]);
        expect(result.current.sortDirection).toBe("desc");
        expect(result.current.expandedLogId).toBe(null);
    });
    it("should toggle sort direction", () => {
        const { result } = renderHook(() => useSystemLogs());
        act(() => {
            result.current.toggleSortDirection();
        });
        expect(result.current.sortDirection).toBe("asc");
        act(() => {
            result.current.toggleSortDirection();
        });
        expect(result.current.sortDirection).toBe("desc");
    });
    it("should toggle expanded log ID", () => {
        const { result } = renderHook(() => useSystemLogs());
        act(() => {
            result.current.toggleExpandLog("123");
        });
        expect(result.current.expandedLogId).toBe("123");
        // Toggle same ID should collapse
        act(() => {
            result.current.toggleExpandLog("123");
        });
        expect(result.current.expandedLogId).toBe(null);
        // Toggle different ID should expand new one
        act(() => {
            result.current.toggleExpandLog("123");
            result.current.toggleExpandLog("456");
        });
        expect(result.current.expandedLogId).toBe("456");
    });
    // Add tests for filtering logic
    it("should filter logs based on activeTab", async () => {
        const { result } = renderHook(() => useSystemLogs());
        // Set logs and then update filter
        act(() => {
            // @ts-ignore - Setting internal state for testing
            result.current.setLogs(mockLogs);
            result.current.setActiveTab("error");
        });
        // Let the useEffect run
        await vi.runAllTimersAsync();
        expect(result.current.filteredLogs).toHaveLength(1);
        expect(result.current.filteredLogs[0].level).toBe("error");
    });
});
