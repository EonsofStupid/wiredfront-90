
import { marked } from 'marked';
import { MessageType } from '@/types/chat/enums';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

/**
 * Format text message content based on type
 */
export function formatMessageContent(content: string, type: MessageType): string {
  if (!content) return '';
  
  switch (type) {
    case MessageType.Code:
      return formatCodeContent(content);
    case MessageType.Text:
      return formatTextContent(content);
    case MessageType.System:
      return formatSystemContent(content);
    case MessageType.Image:
      return content; // Image URLs are passed through
    case MessageType.Link:
      return formatLinkContent(content);
    case MessageType.Document:
      return formatDocumentContent(content);
    default:
      return formatTextContent(content);
  }
}

/**
 * Format code content with syntax highlighting
 */
function formatCodeContent(content: string): string {
  try {
    // Set up code highlighting with marked
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      }
    });
    
    // Parse with marked and sanitize
    const html = marked(content);
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Error formatting code content:', error);
    return escapeHtml(content);
  }
}

/**
 * Format regular text content with markdown
 */
function formatTextContent(content: string): string {
  try {
    // Parse with marked and sanitize
    const html = marked(content);
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Error formatting text content:', error);
    return escapeHtml(content);
  }
}

/**
 * Format system content with special styling
 */
function formatSystemContent(content: string): string {
  try {
    // Add special CSS class for system messages
    const html = marked(content);
    return DOMPurify.sanitize(`<div class="system-message">${html}</div>`);
  } catch (error) {
    console.error('Error formatting system content:', error);
    return escapeHtml(content);
  }
}

/**
 * Format link content
 */
function formatLinkContent(content: string): string {
  try {
    // Check if content is a valid URL
    const url = new URL(content);
    return DOMPurify.sanitize(`<a href="${url.href}" target="_blank" rel="noopener noreferrer">${url.href}</a>`);
  } catch (error) {
    // If not a valid URL, just return the content
    return escapeHtml(content);
  }
}

/**
 * Format document content
 */
function formatDocumentContent(content: string): string {
  try {
    // Assume content is markdown with document metadata
    const html = marked(content);
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Error formatting document content:', error);
    return escapeHtml(content);
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(content: string): string {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Extract code blocks from a markdown string
 */
export function extractCodeBlocks(markdown: string): { language: string; code: string }[] {
  const codeBlockRegex = /```([a-zA-Z0-9_]*)\n([\s\S]*?)```/g;
  const codeBlocks: { language: string; code: string }[] = [];
  
  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    codeBlocks.push({
      language: match[1],
      code: match[2].trim()
    });
  }
  
  return codeBlocks;
}

/**
 * Strip markdown formatting from text
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#+\s+(.*)/g, '$1') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/!\[(.*?)\]\((.*?)\)/g, '$1') // Remove images
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
    .replace(/\n\s*\n/g, '\n'); // Remove extra newlines
}
