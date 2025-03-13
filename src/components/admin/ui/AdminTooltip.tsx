
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
      // Base styles
      "z-[var(--z-tooltip)] overflow-hidden rounded-md shadow-lg",
      // Animation styles
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // WiredFront admin styling
      "border border-white/20 px-3 py-2 text-sm font-medium",
      "bg-gradient-to-r from-[#8B5CF6]/90 to-[#D946EF]/90 text-white backdrop-blur-md",
      "admin-tooltip-content",
      className
    )}
    {...props}
  />
));
AdminTooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { AdminTooltip, AdminTooltipTrigger, AdminTooltipContent, AdminTooltipProvider };
