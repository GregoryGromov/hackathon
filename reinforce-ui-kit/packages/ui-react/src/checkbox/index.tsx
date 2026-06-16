import {
  type CheckboxRootVariants,
  checkboxIndicatorClass,
  checkboxRootVariants,
} from '@reinforce/ui-primitives/checkbox';
import { cn } from '@reinforce/ui-styles/cn';
import { CheckIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import type * as React from 'react';

function Checkbox({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & CheckboxRootVariants) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      className={cn(checkboxRootVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={checkboxIndicatorClass}
      >
        <CheckIcon className="size-3.5" strokeWidth={1.75} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
