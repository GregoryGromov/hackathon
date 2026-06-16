import { cva, type VariantProps } from 'class-variance-authority';

// flat CSS Grid; highlight via single overlay — see README §comparison-table
export const comparisonTableContainerClass =
  'glass relative grid overflow-hidden rounded-2xl [--glass-tint:0.7] dark:[--glass-tint:0.4]';

// Right fade-edge via mask-image (`to right`) — left sticky-column stays unmasked.
export const comparisonTableScrollContainerClass =
  'glass relative grid overflow-x-auto rounded-2xl [--glass-tint:0.7] dark:[--glass-tint:0.4] [mask-image:linear-gradient(to_right,black_calc(100%_-_2.5rem),transparent)]';

// overlay on grid-item (`grid-row: 1 / -1`), pointer-events-none; tint light>dark — see README §comparison-table
export const comparisonTableHighlightOverlayClass =
  'pointer-events-none rounded-xl ring-1 ring-inset ring-primary/40 dark:ring-primary/30 bg-primary/16 dark:bg-primary/10';

// row-hover via consumer's `display:contents` group/row wrapper — see README §comparison-table
export const comparisonTableCellVariants = cva(
  'p-5 transition-colors group-hover/row:bg-foreground/[0.04] dark:group-hover/row:bg-foreground/[0.06]',
  {
    variants: {
      role: {
        // `flex items-center` (no self-center): cell fills grid-row, text vertically centered,
        // hover-bg covers full height.
        label:
          'flex items-center text-base font-semibold text-foreground group-hover/row:text-primary',
        head: 'pb-3 text-center text-sm font-bold text-foreground',
        body: 'flex flex-col items-center justify-center gap-2',
      },
    },
    defaultVariants: { role: 'body' },
  },
);

export const comparisonTableStickyLabelClass =
  'sticky left-0 z-10 self-stretch border-r border-border/40 bg-card/95 backdrop-blur-sm shadow-[2px_0_8px_-4px_rgba(0,0,0,0.25)] dark:shadow-[2px_0_8px_-2px_rgba(0,0,0,0.55)]';

export const comparisonTableDotVariants = cva('rounded-full', {
  variants: {
    state: {
      filled: 'bg-foreground/55 dark:bg-foreground/40',
      'filled-highlight': 'bg-primary',
      empty: 'bg-foreground/12 dark:bg-foreground/8',
    },
    size: {
      sm: 'h-2.5 w-2.5',
      md: 'h-3 w-3',
    },
  },
  defaultVariants: { state: 'empty', size: 'md' },
});

export const comparisonTableValueVariants = cva('font-bold tabular-nums text-center', {
  variants: {
    size: {
      sm: 'text-sm leading-snug',
      md: 'text-lg',
    },
    highlight: {
      true: 'text-primary',
      false: 'text-foreground',
    },
  },
  defaultVariants: { size: 'md', highlight: false },
});

export type ComparisonTableCellVariants = VariantProps<typeof comparisonTableCellVariants>;
export type ComparisonTableDotVariants = VariantProps<typeof comparisonTableDotVariants>;
export type ComparisonTableValueVariants = VariantProps<typeof comparisonTableValueVariants>;
