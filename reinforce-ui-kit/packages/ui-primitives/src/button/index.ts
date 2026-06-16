import { cva, type VariantProps } from 'class-variance-authority';

const lift = 'motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-[0.5px]';
const iconLift =
  'motion-safe:hover:translate-y-0 motion-safe:active:translate-y-0 motion-safe:hover:scale-105 motion-safe:active:scale-100';

const loadingState =
  'relative data-[loading=true]:cursor-wait data-[loading=true]:pointer-events-none [&[data-loading=true]>:not([data-slot=button-spinner])]:invisible';

export const buttonSpinnerClass =
  'absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 motion-safe:animate-spin';

export const buttonVariants = cva(
  `focus-ring disabled-state ${loadingState} inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold tracking-tight whitespace-nowrap transition-all duration-[var(--motion-duration-quick)] ease-[var(--motion-ease-standard)] aria-invalid:border-destructive aria-invalid:ring-ring-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  {
    variants: {
      variant: {
        default: `btn-cta ${lift}`,
        destructive: `btn-cta-destructive focus-ring-destructive ${lift}`,
        secondary: `btn-cta-secondary ${lift}`,
        outline: `btn-cta-ghost ${lift}`,
        ghost: 'btn-ghost-soft',
        'ghost-destructive': 'btn-ghost-destructive focus-ring-destructive',
        link: 'link-underline-slide rounded-md text-primary',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm has-[>svg]:px-3',
        xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 px-3 text-sm has-[>svg]:px-2.5',
        lg: 'h-10 px-6 text-sm has-[>svg]:px-4',
        xl: 'h-auto min-h-14 px-5 py-3 text-sm has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        'icon-xl': 'size-14',
      },
    },
    compoundVariants: [
      { size: 'icon', class: iconLift },
      { size: 'icon-xs', class: iconLift },
      { size: 'icon-sm', class: iconLift },
      { size: 'icon-lg', class: iconLift },
      { size: 'icon-xl', class: iconLift },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
