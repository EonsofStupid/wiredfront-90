import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bug } from "lucide-react";
import { MetricsAndAuditTabs } from "./MetricsAndAuditTabs";

export const DebugMenuIcon = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-neon-pink hover:text-neon-blue transition-colors"
        >
          <Bug className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[400px] p-4"
      >
        <MetricsAndAuditTabs />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};