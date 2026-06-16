import { cva, type VariantProps } from 'class-variance-authority';

export const progressRootVariants = cva('glass-weak relative w-full overflow-hidden rounded-full', {
  variants: {
    size: {
      sm: 'h-1',
      default: 'h-2',
      lg: 'h-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type ProgressRootVariants = VariantProps<typeof progressRootVariants>;

export const progressIndicatorClass =
  'glow-primary h-full w-full flex-1 bg-primary transition-transform duration-[var(--motion-duration-elevated)] ease-[var(--motion-ease-standard)]';
