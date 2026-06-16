import { skeletonClass } from '@reinforce/ui-primitives/skeleton';
import { cn } from '@reinforce/ui-styles/cn';
import type * as React from 'react';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="skeleton" className={cn(skeletonClass, className)} {...props} />;
}

export { Skeleton };
