import { cva, type VariantProps } from 'class-variance-authority';

export const radioGroupRootClass = 'grid gap-3';

export const radioGroupItemVariants = cva(
  'focus-ring disabled-state glass-weak glass-link aspect-square shrink-0 rounded-full text-primary transition-[color,box-shadow] aria-invalid:border-destructive aria-invalid:ring-ring-destructive',
  {
    variants: {
      size: {
        sm: 'size-3.5',
        default: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export type RadioGroupItemVariants = VariantProps<typeof radioGroupItemVariants>;

export const radioGroupIndicatorClass = 'relative flex items-center justify-center';

export const radioGroupIndicatorDotClass =
  'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary';
