import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Upload, Grid, List, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DocumentsTopBarProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onSearch: (query: string) => void;
}

export const DocumentsTopBar = ({ view, onViewChange, onSearch }: DocumentsTopBarProps) => {
  const [isExtended, setIsExtended] = useState(false);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative z-[var(--z-navbar)]"
    >
      <div className="glass-card border-b border-neon-blue/20 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-pink h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  className="pl-10 bg-dark-lighter/30 border-neon-blue/20 text-foreground placeholder:text-foreground/50 focus:border-neon-pink/50 transition-colors"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewChange('grid')}
                className={cn(
                  "text-neon-pink hover:text-neon-blue transition-colors",
                  view === 'grid' && "bg-dark-lighter/50"
                )}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewChange('list')}
                className={cn(
                  "text-neon-pink hover:text-neon-blue transition-colors",
                  view === 'list' && "bg-dark-lighter/50"
                )}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                className="bg-dark-lighter/30 text-neon-pink hover:text-neon-blue border border-neon-blue/20 hover:bg-dark-lighter/50 transition-all"
                onClick={() => setIsExtended(!isExtended)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
                <ChevronDown className={cn(
                  "ml-2 h-4 w-4 transition-transform duration-200",
                  isExtended && "transform rotate-180"
                )} />
              </Button>
            </div>
          </div>
          
          {isExtended && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-neon-blue/20 p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Upload options will go here */}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};