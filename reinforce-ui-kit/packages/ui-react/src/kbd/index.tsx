import { type KbdVariants, kbdVariants } from '@reinforce/ui-primitives/kbd';
import { cn } from '@reinforce/ui-styles/cn';
import type * as React from 'react';
import { Children, Fragment } from 'react';

export function Kbd({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'kbd'> & KbdVariants) {
  return (
    <kbd
      data-slot="kbd"
      data-size={size}
      className={cn(kbdVariants({ size }), className)}
      {...props}
    />
  );
}

export function KbdGroup({
  className,
  separator,
  children,
  ...props
}: React.ComponentProps<'span'> & { separator?: React.ReactNode }) {
  const items = Children.toArray(children);
  return (
    <span
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    >
      {items.map((child, i) => (
        <Fragment key={i}>
          {i > 0 && separator}
          {child}
        </Fragment>
      ))}
    </span>
  );
}
