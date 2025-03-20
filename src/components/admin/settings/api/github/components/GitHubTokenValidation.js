import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertCircle, ShieldCheck } from "lucide-react";
export function GitHubTokenValidation({ error, validationState, validationResult }) {
    if (!error && validationState !== "valid") {
        return null;
    }
    return (_jsxs(_Fragment, { children: [error && (_jsxs("div", { className: "p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-sm text-red-100", children: error })] })), validationState === "valid" && validationResult && (_jsxs("div", { className: "p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start", children: [_jsx(ShieldCheck, { className: "h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "text-sm", children: [_jsx("p", { className: "font-medium text-green-100", children: "Token is valid!" }), _jsxs("p", { children: ["Connected to GitHub account: ", _jsxs("span", { className: "font-medium", children: ["@", validationResult.user.login] })] }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: ["Rate limit: ", validationResult.rate_limit.remaining, "/", validationResult.rate_limit.limit, " requests remaining"] })] })] }))] }));
}
