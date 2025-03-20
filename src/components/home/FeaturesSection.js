import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, Code, Database, Settings } from "lucide-react";
const features = [
    {
        icon: Code,
        title: "Advanced Editor",
        description: "Next-gen code editing with real-time collaboration.",
    },
    {
        icon: Activity,
        title: "Live Analytics",
        description: "Real-time performance monitoring and insights.",
    },
    {
        icon: Database,
        title: "Smart Storage",
        description: "Intelligent data management and version control.",
    },
    {
        icon: Settings,
        title: "Full Control",
        description: "Customizable workspace and powerful integrations.",
    },
];
export const FeaturesSection = () => {
    console.log("FeaturesSection rendering");
    const prefersReducedMotion = useReducedMotion();
    return (_jsx("section", { className: "container mx-auto px-4 py-20", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: features.map((feature, index) => {
                console.log(`Rendering feature: ${feature.title}`);
                return (_jsxs(motion.div, { initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" }, transition: { duration: 0.3, delay: index * 0.1 }, className: "glass-card p-6 hover:scale-105 transition-transform duration-300", children: [_jsx("div", { className: "text-neon-blue mb-4", children: _jsx(feature.icon, { className: "w-8 h-8" }) }), _jsx("h3", { className: "text-xl font-semibold mb-2 gradient-text", children: feature.title }), _jsx("p", { className: "text-gray-400", children: feature.description })] }, index));
            }) }) }));
};
