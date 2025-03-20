import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export const Spinner = ({ size = 'md', className }) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };
    return (_jsx("div", { className: cn("animate-spin rounded-full border-t-transparent border-neon-blue", sizeClasses[size], className), children: _jsx("span", { className: "sr-only", children: "Loading..." }) }));
};
