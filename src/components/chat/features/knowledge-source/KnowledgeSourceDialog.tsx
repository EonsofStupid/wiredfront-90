
import React, { useState } from 'react';
import { 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, X } from 'lucide-react';
import { logger } from '@/services/chat/LoggingService';

export function KnowledgeSourceDialog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    logger.info('Searching knowledge sources', { query: searchQuery });
    
    try {
      // This would be replaced with a real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSearchResults([
        { id: 1, title: 'Example Result 1', excerpt: 'This is a sample search result.' },
        { id: 2, title: 'Example Result 2', excerpt: 'Another example of what search results might look like.' },
      ]);
    } catch (error) {
      logger.error('Error searching knowledge sources', { error });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <DialogContent className="chat-dialog-content sm:max-w-[500px]" onEscapeKeyDown={() => logger.info('Dialog closed with escape key')}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-chat-knowledge-text">
          <BookOpen className="h-5 w-5" />
          Knowledge Sources
        </DialogTitle>
        <DialogDescription>
          Search through connected knowledge bases to enhance your AI responses
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSearch} className="mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search knowledge base..."
            className="chat-input pl-10 bg-chat-input-bg text-chat-input-text chat-cyber-border"
          />
        </div>
        
        <div className="mt-4 space-y-2">
          {isSearching ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 border-2 border-chat-knowledge-text rounded-full border-t-transparent"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto chat-messages-container">
              {searchResults.map((result) => (
                <div key={result.id} className="p-3 border border-chat-knowledge-border rounded-md">
                  <h4 className="font-medium text-chat-knowledge-text">{result.title}</h4>
                  <p className="text-sm text-white/80 mt-1">{result.excerpt}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-chat-knowledge-text border-chat-knowledge-border hover:bg-chat-knowledge-text/10"
                  >
                    Insert Reference
                  </Button>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-6 text-white/60">
              No results found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      </form>
      
      <DialogFooter className="mt-4">
        <Button type="button" variant="secondary" onClick={() => setSearchQuery('')}>
          <X className="mr-2 h-4 w-4" />
          Clear Search
        </Button>
        <Button type="submit" onClick={handleSearch} disabled={!searchQuery.trim() || isSearching}>
          <Search className="mr-2 h-4 w-4" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
