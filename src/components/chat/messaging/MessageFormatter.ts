
import { MessageType } from '../types';

/**
 * Format a message based on its type
 */
export function formatMessage(content: string, type: MessageType): string {
  switch (type) {
    case 'code':
      return formatCodeMessage(content);
    case 'system':
      return formatSystemMessage(content);
    case 'image':
      return formatImageMessage(content);
    default:
      return content;
  }
}

/**
 * Format code message with syntax highlighting placeholders
 */
function formatCodeMessage(content: string): string {
  // Replace actual code blocks with formatted versions
  return content.replace(
    /```(\w+)?\s*\n([\s\S]*?)```/g,
    (match, language, code) => {
      const formattedCode = code.trim();
      const displayLanguage = language || 'text';
      
      return `<div class="code-block">
        <div class="code-header">
          <span class="language-tag">${displayLanguage}</span>
        </div>
        <pre><code class="language-${displayLanguage}">${formattedCode}</code></pre>
      </div>`;
    }
  );
}

/**
 * Format system messages with visual distinction
 */
function formatSystemMessage(content: string): string {
  // Try to parse as JSON for structured display
  try {
    const parsed = JSON.parse(content);
    return `<div class="system-message">${JSON.stringify(parsed, null, 2)}</div>`;
  } catch (e) {
    // Not JSON, display as regular system message
    return `<div class="system-message">${content}</div>`;
  }
}

/**
 * Format image messages with proper HTML
 */
function formatImageMessage(content: string): string {
  if (content.startsWith('http')) {
    return `<img src="${content}" alt="AI Generated Image" class="message-image" />`;
  }
  return content;
}
