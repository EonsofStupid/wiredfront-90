import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Github, CheckCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
export function GitHubTokenCard({ token, onDelete }) {
    const isValid = token.validation_status === 'valid';
    const lastValidated = token.last_validated ? formatDistanceToNow(new Date(token.last_validated), { addSuffix: true }) : 'never';
    const username = token.provider_settings?.github_username || 'Unknown';
    return (_jsxs(Card, { className: "border-[#8B5CF6]/20 overflow-hidden", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Github, { className: "h-4 w-4 mr-2 text-[#8B5CF6]" }), token.memorable_name] }), _jsxs(CardDescription, { children: ["Connected to @", username] })] }), _jsx(Badge, { className: isValid ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" :
                                "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20", children: isValid ? (_jsxs("span", { className: "flex items-center", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), "Valid"] })) : (_jsxs("span", { className: "flex items-center", children: [_jsx(AlertCircle, { className: "h-3 w-3 mr-1" }), "Invalid"] })) })] }) }), _jsx(CardContent, { className: "pb-2", children: _jsxs("div", { className: "text-sm text-muted-foreground", children: [_jsxs("p", { className: "mb-1", children: [_jsx("span", { className: "font-medium text-foreground", children: "Last validated:" }), " ", lastValidated] }), token.provider_settings?.scopes && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-foreground", children: "Scopes:" }), " ", Array.isArray(token.provider_settings.scopes) ? token.provider_settings.scopes.join(', ') : 'N/A'] }))] }) }), _jsx(CardFooter, { className: "border-t border-[#8B5CF6]/10 pt-4 flex justify-end gap-2", children: _jsxs(Button, { variant: "outline", size: "sm", className: "border-red-500/20 text-red-500 hover:bg-red-500/10", onClick: onDelete, children: [_jsx(Trash2, { className: "h-4 w-4 mr-2" }), "Delete"] }) })] }));
}
