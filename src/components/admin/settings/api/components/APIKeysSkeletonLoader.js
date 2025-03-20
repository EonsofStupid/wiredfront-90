import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton } from "@/components/ui/skeleton";
export function APIKeysSkeletonLoader() {
    return (_jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { className: "h-[125px] w-full rounded-lg" }), _jsx(Skeleton, { className: "h-[125px] w-full rounded-lg" })] }));
}
