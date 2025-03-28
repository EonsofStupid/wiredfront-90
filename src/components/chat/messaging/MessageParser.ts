
import { MessageType } from '@/types/chat/enums';

/**
 * Parse message content to extract structured information
 */
export function parseMessage(content: string): {
  type: MessageType;
  parsedContent: any;
} {
  // Check if content is JSON
  if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
    try {
      const parsedData = JSON.parse(content);
      return {
        type: MessageType.System,
        parsedContent: parsedData
      };
    } catch (e) {
      // Not valid JSON, continue with other checks
    }
  }
  
  // Check for code blocks
  if (content.includes('```')) {
    return {
      type: MessageType.Code,
      parsedContent: extractCodeBlocks(content)
    };
  }
  
  // Default to text type
  return {
    type: MessageType.Text,
    parsedContent: content
  };
}

/**
 * Extract code blocks from markdown text
 */
function extractCodeBlocks(content: string): { language: string; code: string }[] {
  const codeBlockRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
  const blocks: { language: string; code: string }[] = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2]
    });
  }
  
  return blocks;
}

/**
 * Check if a message contains a command
 */
export function parseCommand(content: string): { 
  isCommand: boolean; 
  command: string; 
  args: string[] 
} {
  const trimmed = content.trim();
  
  if (trimmed.startsWith('/')) {
    const parts = trimmed.substring(1).split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    return {
      isCommand: true,
      command,
      args
    };
  }
  
  return {
    isCommand: false,
    command: '',
    args: []
  };
}
