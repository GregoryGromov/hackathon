import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  'glass flex flex-col rounded-2xl text-card-foreground transition-colors',
  {
    variants: {
      size: {
        sm: 'gap-4 py-4',
        default: 'gap-6 py-6',
        lg: 'gap-8 py-8',
      },
      interactive: {
        true: 'glass-hover',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      interactive: false,
    },
  },
);

export type CardVariants = VariantProps<typeof cardVariants>;

export const cardHeaderVariants = cva(
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
  {
    variants: {
      size: {
        sm: 'px-4',
        default: 'px-6',
        lg: 'px-8',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export type CardHeaderVariants = VariantProps<typeof cardHeaderVariants>;

export const cardClass =
  'glass flex flex-col gap-6 rounded-2xl py-6 text-card-foreground transition-colors';

export const cardHeaderClass =
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6';

export const cardTitleClass = 'leading-none font-semibold';

export const cardDescriptionClass = 'text-sm text-muted-foreground';

export const cardActionClass = 'col-start-2 row-span-2 row-start-1 self-start justify-self-end';

export const cardContentVariants = cva('', {
  variants: {
    size: {
      sm: 'px-4',
      default: 'px-6',
      lg: 'px-8',
    },
  },
  defaultVariants: { size: 'default' },
});

export type CardContentVariants = VariantProps<typeof cardContentVariants>;

export const cardContentClass = 'px-6';

export const cardFooterVariants = cva('flex items-center [.border-t]:pt-6', {
  variants: {
    size: {
      sm: 'px-4',
      default: 'px-6',
      lg: 'px-8',
    },
  },
  defaultVariants: { size: 'default' },
});

export type CardFooterVariants = VariantProps<typeof cardFooterVariants>;

export const cardFooterClass = 'flex items-center px-6 [.border-t]:pt-6';
