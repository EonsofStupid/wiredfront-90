import { marked } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { logger } from '@/services/chat/LoggingService';

/**
 * Format markdown content with syntax highlighting
 */
export function formatMarkdown(markdown: string): string {
  try {
    marked.setOptions({
      gfm: true,
      breaks: true,
      sanitize: false,
      smartLists: true,
      langPrefix: 'language-',
      highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    });
    
    const html = marked.parse(markdown);
    return DOMPurify.sanitize(html);
  } catch (error) {
    logger.error('Error formatting markdown', error);
    return DOMPurify.sanitize(markdown);
  }
}
