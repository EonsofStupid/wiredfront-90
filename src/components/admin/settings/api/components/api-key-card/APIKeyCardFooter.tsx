
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowUpRight } from "lucide-react";

interface APIKeyCardFooterProps {
  lastValidated?: string;
}

export function APIKeyCardFooter({ lastValidated }: APIKeyCardFooterProps) {
  return (
    <CardFooter className="bg-muted/40 border-t">
      <div className="w-full text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" /> 
          Last validated: {lastValidated 
            ? new Date(lastValidated).toLocaleString() 
            : 'Never'}
        </div>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          View Details <ArrowUpRight className="h-3 w-3 ml-0.5" />
        </Button>
      </div>
    </CardFooter>
  );
}
