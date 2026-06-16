import {
  type ProgressRootVariants,
  progressIndicatorClass,
  progressRootVariants,
} from '@reinforce/ui-primitives/progress';
import { cn } from '@reinforce/ui-styles/cn';
import { Progress as ProgressPrimitive } from 'radix-ui';
import type * as React from 'react';

function Progress({
  className,
  value,
  size = 'default',
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & ProgressRootVariants) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-size={size}
      className={cn(progressRootVariants({ size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={progressIndicatorClass}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
