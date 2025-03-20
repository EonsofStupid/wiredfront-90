import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export function ModeCard({ title, description, icon, isActive, onSelect }) {
    return (_jsxs(motion.div, { className: cn("flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer", "transition-all duration-300 ease-out bg-gray-900/50", isActive
            ? "border-purple-500 bg-purple-900/30 shadow-lg shadow-purple-500/20"
            : "border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/50"), onClick: onSelect, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: [_jsx("div", { className: "mb-2", children: icon }), _jsx("h3", { className: "text-sm font-bold", children: title }), _jsx("p", { className: "text-xs text-gray-400 text-center mt-1", children: description })] }));
}
