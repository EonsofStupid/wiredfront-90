import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDocumentStore } from '@/stores/documents/store';
import { Card } from '@/components/ui/card';
import { FileText, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
export const DocumentGrid = () => {
    const { documents, loading } = useDocumentStore();
    if (loading) {
        return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4", children: [...Array(8)].map((_, i) => (_jsxs(Card, { className: "animate-pulse glass-card", children: [_jsx("div", { className: "h-32 bg-dark-lighter/30" }), _jsx("div", { className: "h-8 mt-2 bg-dark-lighter/30" })] }, i))) }));
    }
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 }, className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4", children: documents.map((doc) => (_jsx(motion.div, { whileHover: { scale: 1.02 }, className: "group", children: _jsx(Card, { className: "glass-card hover:border-neon-pink/50 transition-all duration-300", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [doc.category ? (_jsx(Folder, { className: "h-5 w-5 text-neon-blue" })) : (_jsx(FileText, { className: "h-5 w-5 text-neon-pink" })), _jsx("h3", { className: "text-lg font-semibold truncate gradient-text", children: doc.title })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm text-foreground/70", children: new Date(doc.created_at || '').toLocaleDateString() }), doc.author && (_jsxs("p", { className: "text-sm text-foreground/70", children: ["Author: ", doc.author] })), doc.tags && doc.tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: doc.tags.map((tag, index) => (_jsx("span", { className: "text-xs px-2 py-1 rounded-full bg-dark-lighter/30 border border-neon-blue/20 text-neon-blue", children: tag }, index))) }))] })] }) }) }, doc.id))) }));
};
