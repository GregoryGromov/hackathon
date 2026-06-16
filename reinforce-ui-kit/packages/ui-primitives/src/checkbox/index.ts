import { cva, type VariantProps } from 'class-variance-authority';

export const checkboxRootVariants = cva(
  'focus-ring disabled-state glass-weak glass-link peer shrink-0 rounded-sm transition-[color,box-shadow] aria-invalid:border-destructive aria-invalid:ring-ring-destructive data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
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

export type CheckboxRootVariants = VariantProps<typeof checkboxRootVariants>;

export const checkboxIndicatorClass = 'grid place-content-center text-current transition-none';
