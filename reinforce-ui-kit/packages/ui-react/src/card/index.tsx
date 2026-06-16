import {
  type CardContentVariants,
  type CardFooterVariants,
  type CardHeaderVariants,
  type CardVariants,
  cardActionClass,
  cardContentVariants,
  cardDescriptionClass,
  cardFooterVariants,
  cardHeaderVariants,
  cardTitleClass,
  cardVariants,
} from '@reinforce/ui-primitives/card';
import { cn } from '@reinforce/ui-styles/cn';
import type * as React from 'react';

function Card({
  className,
  size,
  interactive,
  ...props
}: React.ComponentProps<'div'> & CardVariants) {
  return (
    <div
      data-slot="card"
      data-size={size ?? 'default'}
      className={cn(cardVariants({ size, interactive }), className)}
      {...props}
    />
  );
}

function CardHeader({
  className,
  size,
  ...props
}: React.ComponentProps<'div'> & CardHeaderVariants) {
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ size }), className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn(cardTitleClass, className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-description" className={cn(cardDescriptionClass, className)} {...props} />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn(cardActionClass, className)} {...props} />;
}

function CardContent({
  className,
  size,
  ...props
}: React.ComponentProps<'div'> & CardContentVariants) {
  return (
    <div
      data-slot="card-content"
      className={cn(cardContentVariants({ size }), className)}
      {...props}
    />
  );
}

function CardFooter({
  className,
  size,
  ...props
}: React.ComponentProps<'div'> & CardFooterVariants) {
  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ size }), className)}
      {...props}
    />
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
