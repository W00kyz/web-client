import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography } from '@mui/material';

interface MarkdownHighlighterProps {
  markdown: string;
  regexes?: string[];
}

function highlightText(text: string): (string | JSX.Element)[] {
  const parts = text.split(/(==.*?==)/g);
  return parts.map((part, i) =>
    /^==.*==$/.test(part) ? (
      <mark key={i}>{part.slice(2, -2)}</mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function highlightMarkdown(markdown: string, regexes: string[] = []) {
  let highlighted = markdown;

  regexes.forEach((regexStr) => {
    try {
      const regex = new RegExp(regexStr, 'gi');
      highlighted = highlighted.replace(regex, (match) => `==${match}==`);
    } catch {
      console.warn('Regex inválido:', regexStr);
    }
  });

  return highlighted;
}

export const MarkdownHighlighter: React.FC<MarkdownHighlighterProps> = ({
  markdown,
  regexes = [],
}) => {
  const processed = highlightMarkdown(markdown, regexes);

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <Typography variant="body1">
            {highlightText(children?.toString() || '')}
          </Typography>
        ),
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => (
          <code
            style={{
              background: '#eee',
              padding: '2px 4px',
              borderRadius: 4,
              fontFamily: 'monospace',
            }}
          >
            {children}
          </code>
        ),
      }}
    >
      {processed}
    </ReactMarkdown>
  );
};
