import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2 } from "lucide-react";
export function LogsLoadingState() {
    return (_jsxs("div", { className: "py-8 flex flex-col items-center justify-center", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary mb-4", "data-testid": "logs-loading-spinner" }), _jsx("p", { className: "text-muted-foreground", children: "Loading logs..." })] }));
}
