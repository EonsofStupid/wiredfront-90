
import { useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";
import { APIKeyCardHeader } from "./APIKeyCardHeader";
import { APIKeyDetails } from "./APIKeyDetails";

interface APIKeyCardProps {
  config: APIConfiguration;
  onValidate: (configId: string) => Promise<boolean>;
  onDelete: (configId: string) => Promise<boolean>;
  onRefresh: () => void;
}

export function APIKeyCard({
  config,
  onValidate,
  onDelete,
  onRefresh
}: APIKeyCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="overflow-hidden border-gray-800 bg-slate-900/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
      <APIKeyCardHeader 
        config={config}
        onValidate={onValidate}
        onDelete={onDelete}
        onRefresh={onRefresh}
      />
      
      {expanded && (
        <APIKeyDetails config={config} />
      )}
      
      <CardFooter className="flex justify-center p-2 border-t border-gray-800 bg-slate-800/30">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-200"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              <span>Show More</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
