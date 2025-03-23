
/**
 * {{FeatureName}} Panel Template
 * 
 * This template is used to scaffold a new ChatPanel component.
 * Tokens like {{FeatureName}} will be replaced during scaffolding.
 */

import React from 'react';
import { use{{FeatureName}}TrackedAtoms } from '../hooks/use{{FeatureName}}TrackedAtoms';

interface {{FeatureName}}PanelProps {
  title?: string;
}

export function {{FeatureName}}Panel({ title = "{{FeatureName}}" }: {{FeatureName}}PanelProps) {
  // Use tracked atoms for component state
  const {
    isVisible,
    setIsVisible,
    messages,
    addMessage,
    inputValue,
    setInputValue
  } = use{{FeatureName}}TrackedAtoms();
  
  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    addMessage({
      id: crypto.randomUUID(),
      content: inputValue,
      role: 'user',
      timestamp: new Date().toISOString()
    });
    
    setInputValue('');
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="flex flex-col w-full h-full bg-background border border-border rounded-md shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-primary/10 ml-auto max-w-[80%]'
                : 'bg-muted mr-auto max-w-[80%]'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 min-w-0 p-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
