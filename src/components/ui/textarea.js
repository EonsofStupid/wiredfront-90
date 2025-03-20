import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("textarea", { className: cn("flex min-h-[80px] w-full rounded-md border border-white/10 bg-[#1A1F2C]/80 backdrop-blur-md px-3 py-2 text-sm text-foreground ring-offset-background", "placeholder:text-muted-foreground", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2", "disabled:cursor-not-allowed disabled:opacity-50", "shadow-[0_0_10px_rgba(139,92,246,0.1)]", "transition-colors duration-200", "neon-border", className), ref: ref, ...props }));
});
Textarea.displayName = "Textarea";
export { Textarea };
