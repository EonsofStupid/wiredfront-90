import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Code, FileText } from "lucide-react";
import { Link } from "react-router-dom";
/**
 * Mobile-optimized homepage with quick access cards
 */
export const MobileHome = () => {
    return (_jsxs("div", { className: "space-y-6 pb-6", children: [_jsxs("section", { className: "space-y-3", children: [_jsx("h2", { className: "text-lg font-semibold text-neon-pink", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(QuickActionCard, { title: "Editor", icon: _jsx(Code, { className: "h-5 w-5 text-neon-blue" }), path: "/editor" }), _jsx(QuickActionCard, { title: "Documents", icon: _jsx(FileText, { className: "h-5 w-5 text-neon-blue" }), path: "/documents" })] })] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h2", { className: "text-lg font-semibold text-neon-pink", children: "Recent Activity" }), _jsxs(Card, { className: "bg-dark-lighter border-neon-blue/20", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Latest Updates" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsx(ActivityItem, { title: "Project Initialized", description: "New mobile structure created", time: "Just now" }), _jsx(ActivityItem, { title: "Document Created", description: "Welcome guide for new users", time: "2 hours ago" }), _jsx(ActivityItem, { title: "AI Assistant", description: "New feature suggestion", time: "Yesterday" }), _jsx(Button, { variant: "link", size: "sm", className: "px-0 text-neon-blue", children: "View All Activity" })] })] })] }), _jsxs("section", { className: "space-y-3", children: [_jsx("h2", { className: "text-lg font-semibold text-neon-pink", children: "Resources" }), _jsx(Card, { className: "bg-dark-lighter border-neon-blue/20", children: _jsxs(CardContent, { className: "pt-4", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-neon-blue/20 flex items-center justify-center", children: _jsx(Zap, { className: "h-4 w-4 text-neon-blue" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium", children: "Optimization Tips" }), _jsx("p", { className: "text-xs text-neon-pink/70", children: "Improve your workflow" })] })] }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full border-neon-blue/30 text-neon-blue", children: "View Guide" })] }) })] })] }));
};
/**
 * Quick access card component for common destinations
 */
const QuickActionCard = ({ title, icon, path }) => (_jsx(Link, { to: path, children: _jsx(Card, { className: "bg-dark-lighter border-neon-blue/20 hover:bg-dark-lighter/50 transition-colors", children: _jsxs(CardContent, { className: "p-4 flex flex-col items-center justify-center text-center h-24", children: [_jsx("div", { className: "mb-2", children: icon }), _jsx("h3", { className: "text-sm font-medium", children: title })] }) }) }));
/**
 * Activity item component for recent actions
 */
const ActivityItem = ({ title, description, time }) => (_jsxs("div", { className: "flex items-center justify-between py-1 border-b border-neon-blue/10 last:border-0", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium", children: title }), _jsx("p", { className: "text-xs text-neon-pink/70", children: description })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-xs text-neon-blue/70", children: time }), _jsx(ArrowRight, { className: "h-3 w-3 text-neon-blue/70" })] })] }));
