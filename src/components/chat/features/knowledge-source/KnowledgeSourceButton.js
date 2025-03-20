import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { KnowledgeSourceDialog } from './KnowledgeSourceDialog';
import { logger } from '@/services/chat/LoggingService';
export function KnowledgeSourceButton({ className }) {
    const handleOpenChange = (open) => {
        logger.info('Knowledge source dialog state changed', { open });
    };
    return (_jsxs(Dialog, { onOpenChange: handleOpenChange, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx("button", { className: `flex items-center justify-center h-[var(--chat-input-height)] w-10 rounded-md chat-knowledge-button chat-cyber-glow ${className || ''}`, "aria-label": "Search knowledge sources", "data-testid": "knowledge-source-button", children: _jsx(Search, { className: "h-4 w-4" }) }) }), _jsx(KnowledgeSourceDialog, {})] }));
}
