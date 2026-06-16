import {
  type HeadingVariants,
  headingVariants,
  inlineCodeClass,
  type TextVariants,
  textVariants,
} from '@reinforce/ui-primitives/typography';
import { cn } from '@reinforce/ui-styles/cn';
import { Slot } from 'radix-ui';
import type * as React from 'react';

function Heading({
  className,
  level = 'h1',
  asChild = false,
  ...props
}: React.ComponentProps<'h1'> & HeadingVariants & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'h1';

  return (
    <Comp
      data-slot="heading"
      data-level={level}
      className={cn(headingVariants({ level }), className)}
      {...props}
    />
  );
}

function Text({
  className,
  variant = 'body',
  asChild = false,
  ...props
}: React.ComponentProps<'p'> & TextVariants & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'p';

  return (
    <Comp
      data-slot="text"
      data-variant={variant}
      className={cn(textVariants({ variant }), className)}
      {...props}
    />
  );
}

function InlineCode({ className, ...props }: React.ComponentProps<'code'>) {
  return <code data-slot="inline-code" className={cn(inlineCodeClass, className)} {...props} />;
}

export { Heading, InlineCode, Text };
