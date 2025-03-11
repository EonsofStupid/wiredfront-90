
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, BookOpenIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatUIStore } from '../store/useChatUIStore';

export function RAGModule() {
  const { knowledgeSourceVisible, toggleKnowledgeSource, setKnowledgeSourceVisible } = useChatUIStore();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-focus the search input when the popup becomes visible
  useEffect(() => {
    if (knowledgeSourceVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [knowledgeSourceVisible]);

  // Close the popup when clicking outside
  useEffect(() => {
    if (!knowledgeSourceVisible) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.knowledge-source-popup')) return;
      setKnowledgeSourceVisible(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [knowledgeSourceVisible, setKnowledgeSourceVisible]);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-4 flex items-center justify-center gap-2"
        onClick={toggleKnowledgeSource}
      >
        <BookOpenIcon className="h-4 w-4" />
        Knowledge Sources
      </Button>
      
      {knowledgeSourceVisible && (
        <div className="fixed inset-0 z-[var(--z-dropdown)] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="knowledge-source-popup w-full max-w-md glass-card neon-border animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-neon-teal animate-pulse" />
                  Knowledge Sources
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setKnowledgeSourceVisible(false)}
                  className="h-8 w-8"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-full">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search knowledge base..."
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-input glass-input focus:ring-2 focus:ring-neon-teal focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-md hover:bg-white/5 border border-white/10 transition-colors">
                  <div>
                    <h4 className="font-medium text-white">Project Documentation</h4>
                    <p className="text-sm text-muted-foreground">Technical specifications and guides</p>
                  </div>
                  <Badge variant="outline" className="bg-neon-teal/10 text-neon-teal border-neon-teal/30">
                    Docs
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-md hover:bg-white/5 border border-white/10 transition-colors">
                  <div>
                    <h4 className="font-medium text-white">Code Repository</h4>
                    <p className="text-sm text-muted-foreground">Source code and examples</p>
                  </div>
                  <Badge variant="outline" className="bg-neon-pink/10 text-neon-pink border-neon-pink/30">
                    Code
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-md hover:bg-white/5 border border-white/10 transition-colors">
                  <div>
                    <h4 className="font-medium text-white">Research Papers</h4>
                    <p className="text-sm text-muted-foreground">Academic publications and studies</p>
                  </div>
                  <Badge variant="outline" className="bg-violet-500/10 text-violet-500 border-violet-500/30">
                    Research
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
