import { markdownProseClass } from '@reinforce/ui-primitives/markdown-prose';
import { cn } from '@reinforce/ui-styles/cn';
import type { ComponentProps } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';

const ALLOWED_ELEMENTS = [
  'h1',
  'h2',
  'h3',
  'p',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'a',
  'hr',
  'blockquote',
] as const;

const baseComponents: Components = {
  a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer noopener" />,
};

type MarkdownProseProps = Omit<ComponentProps<'article'>, 'children'> & {
  readonly children: string;
  readonly components?: Components;
};

function MarkdownProse({ children, className, components, ...props }: MarkdownProseProps) {
  return (
    <article data-slot="markdown-prose" className={cn(markdownProseClass, className)} {...props}>
      <ReactMarkdown
        allowedElements={[...ALLOWED_ELEMENTS]}
        unwrapDisallowed
        components={{ ...baseComponents, ...components }}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
}

export type { MarkdownProseProps };
export { MarkdownProse };
