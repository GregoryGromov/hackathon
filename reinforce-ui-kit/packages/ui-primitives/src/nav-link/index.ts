import { cva, type VariantProps } from 'class-variance-authority';

export const navLinkVariants = cva('focus-ring rounded-md transition-colors', {
  variants: {
    variant: {
      desktop: 'px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground',
      mobile:
        'group flex items-center justify-between gap-4 px-6 py-4 text-2xl font-semibold text-foreground hover:text-primary sm:px-8 sm:text-3xl',
    },
  },
  defaultVariants: {
    variant: 'desktop',
  },
});

export type NavLinkVariants = VariantProps<typeof navLinkVariants>;
