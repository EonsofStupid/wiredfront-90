
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, CloudOff } from 'lucide-react';
import { ProviderCategory } from '@/components/chat/store/types/chat-store-types';

interface AIProviderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: ProviderCategory[];
  currentProvider: ProviderCategory | null;
}

export function AIProviderStatusDialog({ 
  open, 
  onOpenChange, 
  providers, 
  currentProvider 
}: AIProviderStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="chat-glass-card border-0 max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            AI Provider Status
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] px-1">
          <div className="space-y-4 my-4">
            {providers.length === 0 ? (
              <div className="p-8 text-center rounded-lg border border-white/10 bg-black/20">
                <CloudOff className="h-10 w-10 mx-auto text-white/40 mb-3" />
                <h3 className="text-lg font-medium text-white">No Providers Available</h3>
                <p className="text-sm text-white/60 mt-2">
                  No AI providers have been configured yet. Set up your API keys in settings.
                </p>
              </div>
            ) : (
              providers.map(provider => (
                <ProviderStatusCard 
                  key={provider.id} 
                  provider={provider} 
                  isActive={currentProvider?.id === provider.id} 
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface ProviderStatusCardProps {
  provider: ProviderCategory;
  isActive: boolean;
}

function ProviderStatusCard({ provider, isActive }: ProviderStatusCardProps) {
  // Mock status for demo - in real app you'd fetch this from the provider's service
  const mockStatuses = [
    'operational', 'degraded', 'outage', 'operational', 'operational', 'degraded'
  ];
  const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
  
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'operational':
        return {
          label: 'Operational',
          color: 'text-green-400',
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          icon: <CheckCircle2 className="h-5 w-5 text-green-400" />
        };
      case 'degraded':
        return {
          label: 'Degraded',
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />
        };
      case 'outage':
        return {
          label: 'Outage',
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          icon: <XCircle className="h-5 w-5 text-red-400" />
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-400',
          bg: 'bg-gray-500/20',
          border: 'border-gray-500/30',
          icon: <AlertTriangle className="h-5 w-5 text-gray-400" />
        };
    }
  };
  
  const status = getStatusDetails(randomStatus);
  
  return (
    <div className={`rounded-lg border ${isActive 
      ? 'bg-chat-neon-purple/10 border-chat-neon-purple/30'
      : 'bg-black/20 border-white/10'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center">
              <h3 className="text-md font-medium text-white">{provider.name}</h3>
              {isActive && (
                <Badge className="ml-2 bg-chat-neon-purple/30 text-white text-[10px]">Active</Badge>
              )}
            </div>
            <p className="text-sm text-white/60 mt-1">{provider.description}</p>
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full ${status.bg} ${status.border}`}>
            {status.icon}
            <span className={`text-xs font-medium ml-1 ${status.color}`}>{status.label}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-black/30 rounded-md p-2">
            <p className="text-xs text-white/50">Supported Models</p>
            <p className="text-sm text-white mt-1">{provider.models.length}</p>
          </div>
          <div className="bg-black/30 rounded-md p-2">
            <p className="text-xs text-white/50">Streaming</p>
            <p className="text-sm text-white mt-1">
              {provider.supportsStreaming ? 'Supported' : 'Not Supported'}
            </p>
          </div>
          <div className="bg-black/30 rounded-md p-2">
            <p className="text-xs text-white/50">Cost / 1K Tokens</p>
            <p className="text-sm text-white mt-1">
              {provider.costPerToken 
                ? `$${provider.costPerToken.toFixed(4)}` 
                : 'Not specified'}
            </p>
          </div>
          <div className="bg-black/30 rounded-md p-2">
            <p className="text-xs text-white/50">Category</p>
            <p className="text-sm text-white mt-1 capitalize">{provider.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
