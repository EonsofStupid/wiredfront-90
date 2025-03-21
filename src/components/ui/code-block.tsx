import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  content: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ content, language = 'typescript', className }: CodeBlockProps) {
  // Check if the content is code (starts with ```)
  const isCode = content.startsWith('```');

  if (!isCode) {
    return <div className={cn("whitespace-pre-wrap", className)}>{content}</div>;
  }

  // Extract language and code content
  const match = content.match(/```(\w+)?\n([\s\S]*?)```/);
  if (!match) return <div className={cn("whitespace-pre-wrap", className)}>{content}</div>;

  const [, lang, code] = match;
  const detectedLanguage = lang || language;

  return (
    <div className={cn("relative group", className)}>
      <SyntaxHighlighter
        language={detectedLanguage}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        showLineNumbers
        wrapLines
        lineNumberStyle={{
          color: 'rgba(255, 255, 255, 0.3)',
          minWidth: '2.5em',
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
