import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { StatusIndicator } from "./StatusIndicator";
import { cn } from "@/lib/utils";
import { Database, HardDrive, Layers, Network, Server, Shield } from "lucide-react";
export function SystemStatusPanel() {
    const [hoveredService, setHoveredService] = useState(null);
    const statuses = [
        {
            name: "API Services",
            status: "healthy",
            icon: _jsx(Network, { className: "h-5 w-5" }),
            details: "All API endpoints responding normally with 99.9% uptime"
        },
        {
            name: "Database",
            status: "warning",
            icon: _jsx(Database, { className: "h-5 w-5" }),
            details: "Experiencing higher than normal query times"
        },
        {
            name: "Authentication",
            status: "healthy",
            icon: _jsx(Shield, { className: "h-5 w-5" }),
            details: "User authentication services operating normally"
        },
        {
            name: "Storage",
            status: "critical",
            icon: _jsx(HardDrive, { className: "h-5 w-5" }),
            details: "Critical disk space issue detected on primary storage node"
        },
        {
            name: "Caching",
            status: "healthy",
            icon: _jsx(Layers, { className: "h-5 w-5" }),
            details: "Redis cache hit ratio at 94.2%, performing optimally"
        },
        {
            name: "Web Servers",
            status: "healthy",
            icon: _jsx(Server, { className: "h-5 w-5" }),
            details: "Load balanced servers operating within normal parameters"
        }
    ];
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.2 }, className: cn("relative p-6 rounded-xl overflow-hidden", "bg-gradient-to-br from-[#1A1F2C]/80 to-[#121318]/95", "backdrop-blur-lg border border-white/5", "shadow-[0_8px_30px_rgba(0,0,0,0.5)]"), children: [_jsx("div", { className: "absolute inset-0 hero--cyberpunk-ui opacity-30" }), _jsxs("h3", { className: "text-lg font-semibold text-white relative z-10 mb-4 flex items-center space-x-2", children: [_jsx(Server, { className: "h-5 w-5 text-[#8B5CF6]" }), _jsx("span", { children: "System Status" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10", children: statuses.map((service) => (_jsx(motion.div, { className: cn("p-4 rounded-lg cursor-pointer transition-all duration-300", "bg-[#1A1F2C]/70 backdrop-blur border border-white/5", "hover:border-[#8B5CF6]/30 hover:bg-[#1A1F2C]/90", service.status === 'healthy' && "hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]", service.status === 'warning' && "hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]", service.status === 'critical' && "hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"), whileHover: { scale: 1.02 }, onMouseEnter: () => setHoveredService(service.name), onMouseLeave: () => setHoveredService(null), children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: cn("p-2 rounded-lg", service.status === 'healthy' && "bg-green-500/20 text-green-400", service.status === 'warning' && "bg-yellow-500/20 text-yellow-400", service.status === 'critical' && "bg-red-500/20 text-red-400"), children: service.icon }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-medium text-white/90", children: service.name }), _jsx(StatusIndicator, { status: service.status, compact: true })] }), hoveredService === service.name && (_jsx(motion.p, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, className: "text-xs mt-2 text-white/60", children: service.details }))] })] }) }, service.name))) })] }));
}
