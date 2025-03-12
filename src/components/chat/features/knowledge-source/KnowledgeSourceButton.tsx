
import React from 'react';
import { Search } from 'lucide-react';
import { 
  Dialog, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { KnowledgeSourceDialog } from './KnowledgeSourceDialog';
import { logger } from '@/services/chat/LoggingService';

interface KnowledgeSourceButtonProps {
  className?: string;
}

export function KnowledgeSourceButton({ className }: KnowledgeSourceButtonProps) {
  const handleOpenChange = (open: boolean) => {
    logger.info('Knowledge source dialog state changed', { open });
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button 
          className={`flex items-center justify-center h-10 w-10 rounded-md chat-knowledge-button chat-cyber-glow ${className || ''}`}
          aria-label="Search knowledge sources"
          data-testid="knowledge-source-button"
        >
          <Search className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <KnowledgeSourceDialog />
    </Dialog>
  );
}
