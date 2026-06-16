import {
  type RadioGroupItemVariants,
  radioGroupIndicatorClass,
  radioGroupIndicatorDotClass,
  radioGroupItemVariants,
  radioGroupRootClass,
} from '@reinforce/ui-primitives/radio-group';
import { cn } from '@reinforce/ui-styles/cn';
import { CircleIcon } from 'lucide-react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import type * as React from 'react';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn(radioGroupRootClass, className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & RadioGroupItemVariants) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      data-size={size}
      className={cn(radioGroupItemVariants({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={radioGroupIndicatorClass}
      >
        <CircleIcon className={radioGroupIndicatorDotClass} strokeWidth={1.75} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
