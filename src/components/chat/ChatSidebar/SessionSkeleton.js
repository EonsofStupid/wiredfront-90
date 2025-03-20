import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton } from '@/components/ui/skeleton';
const SessionSkeleton = ({ count = 3 }) => {
    return (_jsx("div", { className: "space-y-3 p-2", children: Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: "flex flex-col space-y-2 p-3 border border-white/5 rounded-md animate-pulse", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Skeleton, { className: "h-4 w-24" }), _jsx(Skeleton, { className: "h-4 w-10" })] }), _jsx(Skeleton, { className: "h-3 w-32" }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Skeleton, { className: "h-3 w-16" }), _jsx(Skeleton, { className: "h-3 w-8" })] })] }, i))) }));
};
export default SessionSkeleton;
