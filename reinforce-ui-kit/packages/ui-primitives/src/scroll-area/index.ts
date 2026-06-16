import { cva, type VariantProps } from 'class-variance-authority';

export const scrollAreaRootClass = 'relative';

export const scrollAreaViewportClass =
  'focus-ring size-full rounded-[inherit] transition-[color,box-shadow]';

export const scrollAreaScrollbarVariants = cva(
  'flex touch-none select-none p-px transition-colors',
  {
    variants: {
      orientation: {
        vertical: 'h-full w-2.5 border-l border-l-transparent',
        horizontal: 'h-2.5 flex-col border-t border-t-transparent',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  },
);

export type ScrollAreaScrollbarVariants = VariantProps<typeof scrollAreaScrollbarVariants>;

export const scrollAreaThumbClass = 'relative flex-1 rounded-full bg-border';
