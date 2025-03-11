
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const AdminTooltipProvider = TooltipPrimitive.Provider;

const AdminTooltip = TooltipPrimitive.Root;

const AdminTooltipTrigger = TooltipPrimitive.Trigger;

const AdminTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-[var(--z-tooltip)] overflow-hidden rounded-md border border-white/20 px-3 py-2 text-base font-medium shadow-lg",
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white backdrop-blur-md",
      "before:absolute before:inset-0 before:rounded-md before:opacity-30 before:shadow-[0_0_15px_rgba(139,92,246,0.8),0_0_30px_rgba(217,70,239,0.5)]",
      className
    )}
    {...props}
  />
));
AdminTooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { AdminTooltip, AdminTooltipTrigger, AdminTooltipContent, AdminTooltipProvider };
