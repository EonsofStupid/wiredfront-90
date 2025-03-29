
import { marked } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { logger } from '@/services/chat/LoggingService';

/**
 * Configure marked options
 */
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code, lang) {
    try {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    } catch (e) {
      logger.error('Highlighting error:', e);
      return code;
    }
  },
  langPrefix: 'hljs language-',
  pedantic: false,
  gfm: true,
  breaks: true,
  sanitize: false,
  headerIds: true,
  mangle: true
});

/**
 * Format a text message with Markdown
 */
export async function formatMessage(content: string): Promise<string> {
  try {
    // First parse markdown
    const markedOutput = await Promise.resolve(marked(content));
    
    // Then sanitize HTML
    const sanitized = DOMPurify.sanitize(markedOutput, {
      ALLOWED_TAGS: [
        'a', 'b', 'blockquote', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 's', 'span', 'strong', 'table', 'tbody',
        'td', 'th', 'thead', 'tr', 'u', 'ul'
      ],
      ALLOWED_ATTR: ['href', 'class', 'style', 'src', 'alt', 'title', 'target', 'rel']
    });
    
    return sanitized;
  } catch (error) {
    logger.error('Error formatting message', error);
    return content;
  }
}

/**
 * Format code block for syntax highlighting
 */
export function formatCodeBlock(code: string, language: string = 'typescript'): string {
  try {
    const highlightedCode = hljs.highlight(code, { language }).value;
    return highlightedCode;
  } catch (error) {
    logger.error('Error formatting code block', error);
    return code;
  }
}

/**
 * Extract code blocks from a message
 */
export function extractCodeBlocks(content: string): { language: string; code: string }[] {
  const codeBlockRegex = /```([\w-]*)\n([\s\S]*?)```/g;
  const matches: { language: string; code: string }[] = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    matches.push({
      language: match[1] || 'plaintext',
      code: match[2]
    });
  }
  
  return matches;
}
