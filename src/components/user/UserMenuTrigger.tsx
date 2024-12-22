import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const UserMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          ref={ref}
          variant="ghost" 
          size="icon"
          className="animate-hover-button text-neon-pink hover:text-neon-blue relative"
          {...props}
        >
          <User className="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Account</TooltipContent>
    </Tooltip>
  );
});

UserMenuTrigger.displayName = "UserMenuTrigger";

export { UserMenuTrigger };