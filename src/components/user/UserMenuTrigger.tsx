import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const UserMenuTrigger = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="animate-hover-button text-neon-pink hover:text-neon-blue relative"
        >
          <User className="w-5 h-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Account</TooltipContent>
    </Tooltip>
  );
};