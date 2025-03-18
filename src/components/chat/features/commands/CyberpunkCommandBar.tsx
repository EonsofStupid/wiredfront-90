
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommandItem {
  id: string;
  name: string;
  description: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CyberpunkCommandBarProps {
  onClose: () => void;
}

const CyberpunkCommandBar: React.FC<CyberpunkCommandBarProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Sample commands - in a real implementation, these would be loaded dynamically
  const commands: CommandItem[] = [
    {
      id: 'mem-list',
      name: '/mem list',
      description: 'View stored AI memories',
      category: 'Memory',
      shortcut: 'Ctrl+M',
      action: () => console.log('Listing memories')
    },
    {
      id: 'task-add',
      name: '/task add',
      description: 'Add a new task or automation',
      category: 'Tasks',
      shortcut: 'Ctrl+T',
      action: () => console.log('Adding task')
    },
    {
      id: 'docs-find',
      name: '/docs find',
      description: 'Search in indexed documents',
      category: 'Files',
      shortcut: 'Ctrl+F',
      action: () => console.log('Finding docs')
    },
    {
      id: 'settings-theme',
      name: '/settings theme',
      description: 'Change UI theme',
      category: 'Settings',
      shortcut: 'Ctrl+,',
      action: () => console.log('Changing theme')
    },
    {
      id: 'github-prs',
      name: '/github prs',
      description: 'List GitHub pull requests',
      category: 'GitHub',
      shortcut: 'Ctrl+G P',
      action: () => console.log('Listing PRs')
    }
  ];
  
  // Filter commands based on search query
  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };
  
  const executeCommand = (command: CommandItem) => {
    command.action();
    onClose();
  };

  return (
    <div className="chat-cyberpunk-command-bar">
      <div className="chat-cyberpunk-command-input">
        <Search className="chat-cyberpunk-command-icon" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or search..."
          className="chat-cyberpunk-command-search"
        />
        <div className="chat-cyberpunk-command-badge">
          <Command className="h-3 w-3 mr-1" />
          <span>Commands</span>
        </div>
      </div>
      
      <div className="chat-cyberpunk-command-list">
        {filteredCommands.length === 0 ? (
          <div className="chat-cyberpunk-command-empty">
            No commands found. Try a different search.
          </div>
        ) : (
          filteredCommands.map((command, index) => (
            <div 
              key={command.id}
              className={`chat-cyberpunk-command-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => executeCommand(command)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="chat-cyberpunk-command-item-content">
                <div className="chat-cyberpunk-command-item-name">
                  {command.name}
                </div>
                <div className="chat-cyberpunk-command-item-description">
                  {command.description}
                </div>
              </div>
              
              <div className="chat-cyberpunk-command-item-action">
                {command.shortcut && (
                  <div className="chat-cyberpunk-command-item-shortcut">
                    {command.shortcut}
                  </div>
                )}
                <ArrowRight className="h-3 w-3 ml-2" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CyberpunkCommandBar;
