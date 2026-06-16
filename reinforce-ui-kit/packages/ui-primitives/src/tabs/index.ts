import { cva, type VariantProps } from 'class-variance-authority';

export const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center gap-1 rounded-xl p-1 text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'glass-weak',
        line: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type TabsListVariants = VariantProps<typeof tabsListVariants>;

export const tabsRootClass = 'group/tabs flex gap-2 data-[orientation=horizontal]:flex-col';

export const tabsTriggerVariants = cva(
  [
    "focus-ring disabled-state motion-press relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none',
    'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
    'data-[state=active]:bg-card data-[state=active]:text-foreground',
    'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-7 px-2',
        default: 'h-8 px-2.5',
        lg: 'h-9 px-3',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export type TabsTriggerVariants = VariantProps<typeof tabsTriggerVariants>;

export const tabsContentClass = 'flex-1 outline-none';
