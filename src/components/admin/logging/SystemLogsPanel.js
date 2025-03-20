import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { LogsHeader } from "./LogsHeader";
import { LogsFilterBar } from "./LogsFilterBar";
import { LogsTabs } from "./LogsTabs";
import { LogsLoadingState } from "./LogsLoadingState";
import { LogsErrorState } from "./LogsErrorState";
import { LogsEmptyState } from "./LogsEmptyState";
import { LogsTable } from "./LogsTable";
import { useSystemLogs } from "./useSystemLogs";
export function SystemLogsPanel() {
    const { logs, filteredLogs, isLoading, error, activeTab, setActiveTab, searchQuery, setSearchQuery, sourceFilter, setSourceFilter, uniqueSources, sortDirection, expandedLogId, fetchLogs, handleClearLogs, downloadLogs, toggleSortDirection, toggleExpandLog } = useSystemLogs();
    return (_jsxs(Card, { className: "col-span-3", children: [_jsx(LogsHeader, {}), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsx(LogsFilterBar, { searchQuery: searchQuery, setSearchQuery: setSearchQuery, sourceFilter: sourceFilter, setSourceFilter: setSourceFilter, uniqueSources: uniqueSources, sortDirection: sortDirection, toggleSortDirection: toggleSortDirection, fetchLogs: fetchLogs, downloadLogs: downloadLogs, handleClearLogs: handleClearLogs, isLoading: isLoading, filteredLogs: filteredLogs, logs: logs }), _jsx(LogsTabs, { activeTab: activeTab, setActiveTab: setActiveTab }), _jsx(TabsContent, { value: activeTab, className: "mt-0", children: isLoading ? (_jsx(LogsLoadingState, {})) : error ? (_jsx(LogsErrorState, { error: error })) : filteredLogs.length === 0 ? (_jsx(LogsEmptyState, { logsExist: logs.length > 0 })) : (_jsx(LogsTable, { logs: filteredLogs, expandedLogId: expandedLogId, toggleExpandLog: toggleExpandLog })) })] }) })] }));
}
