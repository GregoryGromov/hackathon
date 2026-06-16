import { cva, type VariantProps } from 'class-variance-authority';

export const toggleVariants = cva(
  "focus-ring disabled-state motion-press inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors aria-invalid:border-destructive aria-invalid:ring-ring-destructive data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-transparent data-[state=on]:shadow-[inset_0_1px_0_var(--surface-tint-medium)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'glass-weak hover:bg-primary/10',
        outline:
          'border border-border bg-transparent hover:bg-primary/10 hover:border-primary/40 hover:text-primary',
      },
      size: {
        default: 'h-9 min-w-9 px-2',
        sm: 'h-8 min-w-8 px-1.5',
        lg: 'h-10 min-w-10 px-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ToggleVariants = VariantProps<typeof toggleVariants>;
