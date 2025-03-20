import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { APIKeyHeader } from "./APIKeyHeader";
import { APIKeyList } from "./APIKeyList";
import { EmptyAPIKeysList } from "./EmptyAPIKeysList";
import { APIKeysSkeletonLoader } from "./APIKeysSkeletonLoader";
import { Card, CardContent } from "@/components/ui/card";
export function KeyManagementContent({ isLoading, configurations, hasConfigurations, onAddKey, onValidate, onDelete, onRefresh }) {
    return (_jsx(Card, { className: "border-gray-800 bg-slate-900/30 shadow-md", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "grid gap-6", children: [_jsx(APIKeyHeader, { onAddKey: onAddKey }), isLoading && configurations.length === 0 ? (_jsx(APIKeysSkeletonLoader, {})) : hasConfigurations ? (_jsx(APIKeyList, { configurations: configurations, onValidate: onValidate, onDelete: onDelete, onRefresh: onRefresh })) : (_jsx(EmptyAPIKeysList, { onAddKey: onAddKey }))] }) }) }));
}
