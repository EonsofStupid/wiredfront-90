
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// Configure marked options
marked.setOptions({
  highlight: function (code, lang) {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch (e) {
      console.error('Error highlighting code:', e);
      return code;
    }
  },
  breaks: true,
  gfm: true
});

/**
 * Format markdown content to HTML
 */
export async function formatMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return '';
  
  try {
    // Use marked to convert markdown to HTML
    const html = await Promise.resolve(marked.parse(markdown));
    
    // Sanitize the HTML using DOMPurify
    const sanitized = DOMPurify.sanitize(html, {
      ADD_ATTR: ['target', 'rel'],
      ADD_TAGS: ['iframe', 'img', 'video']
    });
    
    return sanitized;
  } catch (error) {
    console.error('Error formatting markdown:', error);
    return markdown;
  }
}

/**
 * Extract code blocks from markdown
 */
export function extractCodeBlocks(markdown: string): { language: string; code: string }[] {
  if (!markdown) return [];
  
  const codeBlocks: { language: string; code: string }[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    codeBlocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    });
  }
  
  return codeBlocks;
}

/**
 * Format error message
 */
export function formatErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.error) return error.error;
  
  try {
    return JSON.stringify(error);
  } catch (e) {
    return 'An error occurred that could not be displayed';
  }
}

/**
 * Clean HTML string of dangerous attributes and tags
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button']
  });
}
