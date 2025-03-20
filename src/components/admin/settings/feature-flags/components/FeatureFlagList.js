import { jsx as _jsx } from "react/jsx-runtime";
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeatureFlagCard } from './FeatureFlagCard';
export function FeatureFlagList({ flags, onToggle, onEdit }) {
    return (_jsx(ScrollArea, { className: "h-[calc(100vh-280px)]", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6", children: flags.map((flag) => (_jsx(FeatureFlagCard, { flag: flag, onToggle: onToggle, onEdit: onEdit }, flag.id))) }) }));
}
