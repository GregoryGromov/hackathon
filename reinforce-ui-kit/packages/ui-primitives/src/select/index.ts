import { cva, type VariantProps } from 'class-variance-authority';

export const selectTriggerVariants = cva(
  "focus-ring disabled-state flex w-fit items-center justify-between gap-2 py-2 pr-2.5 pl-3 text-sm whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring/60 aria-invalid:border-destructive/60 aria-invalid:ring-ring-destructive data-[placeholder]:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
  {
    variants: {
      size: {
        sm: 'h-8',
        default: 'h-9',
        lg: 'h-10',
      },
      appearance: {
        default: 'glass-weak glass-link rounded-md',
        bare: 'btn-ghost-soft rounded-md',
      },
    },
    defaultVariants: { size: 'default', appearance: 'default' },
  },
);

export type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;

export const selectContentClass =
  'glass-strong relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl text-popover-foreground data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95';

export const selectContentPopperClass =
  'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1';

export const selectViewportClass = 'p-1.5';

export const selectViewportPopperClass =
  'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1';

export const selectLabelClass = 'px-2 py-1.5 text-xs text-muted-foreground';

export const selectItemClass =
  "disabled-data-state relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden transition-colors duration-150 select-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[state=checked]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2";

export const selectItemIndicatorClass =
  'absolute right-2 flex size-3.5 items-center justify-center';

export const selectSeparatorClass = 'pointer-events-none -mx-1 my-1 h-px bg-border';

export const selectScrollButtonClass = 'flex cursor-default items-center justify-center py-1';
