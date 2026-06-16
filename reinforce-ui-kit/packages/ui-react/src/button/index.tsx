import {
  type ButtonVariants,
  buttonSpinnerClass,
  buttonVariants,
} from '@reinforce/ui-primitives/button';
import { cn } from '@reinforce/ui-styles/cn';
import { Loader2Icon } from 'lucide-react';
import { Slot } from 'radix-ui';
import type * as React from 'react';

type ButtonBaseProps = React.ComponentProps<'button'> & ButtonVariants;
type ButtonProps =
  | (ButtonBaseProps & { asChild?: false; loading?: boolean })
  | (ButtonBaseProps & { asChild: true; loading?: never });

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {loading ? (
        <Loader2Icon data-slot="button-spinner" aria-hidden className={buttonSpinnerClass} />
      ) : null}
    </button>
  );
}

export { Button, buttonVariants };
