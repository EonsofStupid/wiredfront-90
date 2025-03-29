
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

/**
 * Format message content with markdown and syntax highlighting
 */
export const formatMessage = (content: string): string => {
  // Set up marked with syntax highlighting
  marked.use(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );
  
  // Set up custom renderer for links to open in new tab
  const renderer = new marked.Renderer();
  renderer.link = (href, title, text) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`;
  };
  
  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
    smartLists: true
  });
  
  // Convert markdown to HTML
  const html = marked.parse(content);
  
  // Sanitize HTML to prevent XSS
  return DOMPurify.sanitize(html);
};

/**
 * Extract code blocks from a message
 */
export const extractCodeBlocks = (content: string): { language: string; code: string }[] => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const codeBlocks: { language: string; code: string }[] = [];
  
  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1] || 'plaintext',
      code: match[2]
    });
  }
  
  return codeBlocks;
};

/**
 * Format code with syntax highlighting
 */
export const formatCode = (code: string, language = 'plaintext'): string => {
  try {
    const lang = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(code, { language: lang }).value;
  } catch (e) {
    console.error('Error highlighting code:', e);
    return code;
  }
};

export const MessageFormatter = {
  formatMessage,
  extractCodeBlocks,
  formatCode
};

export default MessageFormatter;
