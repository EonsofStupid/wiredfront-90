
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, CheckCircle, AlertCircle, RefreshCw, BarChart3, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface APIKeyCardProps {
  apiKey: {
    id: string;
    api_type: string;
    memorable_name: string;
    created_at: string;
    last_used?: string;
    validation_status: string;
    usage_metrics?: {
      total_calls?: number;
      remaining_quota?: number;
      last_reset?: string;
    };
  };
  onDelete: () => void;
}

export function APIKeyCard({ apiKey, onDelete }: APIKeyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'invalid':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'expired':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
      case 'pending':
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid':
        return <CheckCircle className="h-4 w-4" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4" />;
      case 'expired':
        return <Clock className="h-4 w-4" />;
      case 'pending':
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const getApiTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'openai':
        return 'OpenAI';
      case 'anthropic':
        return 'Anthropic';
      case 'gemini':
        return 'Google Gemini';
      case 'pinecone':
        return 'Pinecone';
      case 'huggingface':
        return 'HuggingFace';
      default:
        return type;
    }
  };

  return (
    <Card className="overflow-hidden border transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium line-clamp-1">{apiKey.memorable_name}</h3>
                <Badge variant="outline" className="text-xs">
                  {getApiTypeLabel(apiKey.api_type)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Created {formatDistanceToNow(new Date(apiKey.created_at), { addSuffix: true })}</span>
                
                {apiKey.last_used && (
                  <>
                    <span className="px-1">•</span>
                    <span>Last used {formatDistanceToNow(new Date(apiKey.last_used), { addSuffix: true })}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(apiKey.validation_status)} flex items-center gap-1`}>
              {getStatusIcon(apiKey.validation_status)}
              <span className="capitalize">{apiKey.validation_status}</span>
            </Badge>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-100"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        
        {apiKey.usage_metrics && isExpanded && (
          <div className="p-4 pt-0">
            <div className="mt-3 border-t pt-3">
              <div className="text-sm font-medium mb-2 flex items-center gap-1">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Usage Metrics
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">API Calls</div>
                  <div className="font-medium">{apiKey.usage_metrics.total_calls || 0}</div>
                </div>
                <div className="p-2 bg-muted/30 rounded-md">
                  <div className="text-xs text-muted-foreground">Remaining Quota</div>
                  <div className="font-medium">{apiKey.usage_metrics.remaining_quota || 'Unlimited'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center py-1 text-xs text-muted-foreground hover:text-foreground bg-muted/20"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show Details'}
        </Button>
      </CardContent>
    </Card>
  );
}
