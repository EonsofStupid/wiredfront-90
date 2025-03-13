
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import styles from "./styles/UserMenu.module.css";

const UserMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & { className?: string }
>((props, ref) => {
  const { className, ...rest } = props;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          ref={ref}
          variant="ghost" 
          size="icon"
          className={`relative animate-hover-button text-neon-pink hover:text-neon-blue ${className}`}
          {...rest}
        >
          <User className="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        sideOffset={4}
        className={styles.userMenuTooltip}
      >
        Account
      </TooltipContent>
    </Tooltip>
  );
});

UserMenuTrigger.displayName = "UserMenuTrigger";

export { UserMenuTrigger };
