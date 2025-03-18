
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Clock, Trash2, BookmarkPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Memory {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  tags: string[];
}

const CyberpunkMemoryPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent');
  
  // Sample memories - would be fetched from a service in a real implementation
  const memories: Memory[] = [
    {
      id: 'm1',
      title: 'Project Setup Instructions',
      content: 'Run npm install and then npm run dev to start the development server.',
      timestamp: '2023-08-12T14:30:00Z',
      tags: ['setup', 'development']
    },
    {
      id: 'm2',
      title: 'API Authentication Flow',
      content: 'Use JWT tokens for authentication, refresh every 30 minutes.',
      timestamp: '2023-08-10T09:15:00Z',
      tags: ['api', 'security']
    },
    {
      id: 'm3',
      title: 'Database Migration Plan',
      content: 'Migrate from MongoDB to PostgreSQL by end of Q3.',
      timestamp: '2023-08-05T16:45:00Z',
      tags: ['database', 'planning']
    }
  ];
  
  // Filter memories based on search and active tab
  const filteredMemories = memories.filter(memory => 
    (memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="chat-cyberpunk-memory-panel">
      <div className="chat-cyberpunk-memory-search">
        <Search className="chat-cyberpunk-memory-search-icon" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories..."
          className="chat-cyberpunk-memory-search-input"
        />
      </div>
      
      <div className="chat-cyberpunk-memory-tabs">
        <Button
          variant={activeTab === 'recent' ? 'default' : 'ghost'}
          size="sm"
          className="chat-cyberpunk-memory-tab"
          onClick={() => setActiveTab('recent')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Recent
        </Button>
        
        <Button
          variant={activeTab === 'saved' ? 'default' : 'ghost'}
          size="sm"
          className="chat-cyberpunk-memory-tab"
          onClick={() => setActiveTab('saved')}
        >
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Saved
        </Button>
      </div>
      
      <div className="chat-cyberpunk-memory-list">
        {filteredMemories.length === 0 ? (
          <div className="chat-cyberpunk-memory-empty">
            No memories found. Try a different search.
          </div>
        ) : (
          filteredMemories.map(memory => (
            <div key={memory.id} className="chat-cyberpunk-memory-item">
              <div className="chat-cyberpunk-memory-item-header">
                <h4 className="chat-cyberpunk-memory-item-title">{memory.title}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="chat-cyberpunk-memory-item-delete"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="chat-cyberpunk-memory-item-content">{memory.content}</p>
              
              <div className="chat-cyberpunk-memory-item-footer">
                <div className="chat-cyberpunk-memory-item-tags">
                  {memory.tags.map(tag => (
                    <span key={tag} className="chat-cyberpunk-memory-item-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="chat-cyberpunk-memory-item-timestamp">
                  {new Date(memory.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CyberpunkMemoryPanel;
