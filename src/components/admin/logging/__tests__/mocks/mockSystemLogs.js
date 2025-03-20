import { vi } from "vitest";
export const createMockSystemLogs = () => {
    return {
        logs: [
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
        ],
        filteredLogs: [
            {
                id: "1",
                timestamp: "2023-01-01T12:00:00Z",
                level: "info",
                source: "auth",
                message: "User logged in",
                metadata: { userId: "123" },
                user_id: "user1"
            }
        ],
        isLoading: false,
        error: null,
        activeTab: "all",
        setActiveTab: vi.fn(),
        searchQuery: "",
        setSearchQuery: vi.fn(),
        sourceFilter: null,
        setSourceFilter: vi.fn(),
        uniqueSources: ["auth", "api"],
        sortDirection: "desc",
        expandedLogId: null,
        fetchLogs: vi.fn(),
        handleClearLogs: vi.fn(),
        downloadLogs: vi.fn(),
        toggleSortDirection: vi.fn(),
        toggleExpandLog: vi.fn()
    };
};
// Mock the hook
export const mockUseSystemLogs = vi.fn().mockImplementation(createMockSystemLogs);
