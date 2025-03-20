import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
export const Spinner = ({ size = 'md', className = '', label = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    };
    return (_jsxs("div", { className: cn('flex items-center justify-center gap-2', className), children: [_jsx(Loader2, { className: cn('animate-spin', sizeClasses[size]) }), label && _jsx("span", { className: "sr-only", children: label })] }));
};
