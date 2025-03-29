
import React, { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/chat/shared/Spinner';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAIProviders } from '@/hooks/chat/useAIProviders';
import { useProviderChanges } from '@/hooks/useProviderChanges';
import { Provider } from '@/components/chat/types/provider-types';

interface AIProviderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIProviderStatusDialog = ({ open, onOpenChange }: AIProviderStatusDialogProps) => {
  const { providers, isLoading, error, fetchProviders } = useAIProviders();
  const { currentProvider, changeProvider, refreshProviders } = useProviderChanges();
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    if (open) {
      fetchProviders();
    }
  }, [open, fetchProviders]);

  useEffect(() => {
    if (currentProvider && providers.length > 0) {
      setSelectedProvider(currentProvider);
    } else if (providers.length > 0) {
      setSelectedProvider(providers[0]);
    }
  }, [currentProvider, providers]);

  const handleChangeProvider = async (provider: Provider) => {
    try {
      if (!provider.isEnabled) {
        toast.error(`Provider ${provider.name} is disabled`);
        return;
      }
      
      const success = await changeProvider(provider.id);
      if (success) {
        toast.success(`Switched to ${provider.name}`);
        setSelectedProvider(provider);
      } else {
        toast.error(`Failed to switch to ${provider.name}`);
      }
    } catch (error) {
      toast.error('Error changing provider');
    }
  };

  const handleRefresh = () => {
    fetchProviders();
    refreshProviders();
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner size="lg" />
            <p className="mt-4">Loading providers...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            AI Provider Status
            <Button variant="ghost" size="icon" onClick={handleRefresh} className="h-6 w-6">
              <span className="sr-only">Refresh</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {error ? (
          <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-3">
            <AlertCircle className="text-destructive" />
            <p className="text-destructive">Failed to load providers: {error.message}</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select the AI provider you want to use for generating responses.
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`border rounded-lg p-3 cursor-pointer flex items-center justify-between ${
                      selectedProvider?.id === provider.id ? 'bg-primary/10 border-primary/50' : ''
                    } ${!provider.isEnabled ? 'opacity-50' : ''}`}
                    onClick={() => provider.isEnabled && handleChangeProvider(provider)}
                  >
                    <div className="flex items-center gap-3">
                      {provider.iconUrl ? (
                        <img src={provider.iconUrl} alt={provider.name} className="w-6 h-6" />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      )}
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {provider.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {provider.isEnabled ? (
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Disabled
                        </Badge>
                      )}
                      
                      {selectedProvider?.id === provider.id && (
                        <Badge>Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
