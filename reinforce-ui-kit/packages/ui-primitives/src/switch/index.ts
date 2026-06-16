import { cva, type VariantProps } from 'class-variance-authority';

export const switchRootVariants = cva(
  'focus-ring disabled-state glass-weak peer group/switch inline-flex shrink-0 items-center rounded-full border-transparent transition-colors data-[state=checked]:bg-switch-track-checked data-[state=unchecked]:bg-switch-track',
  {
    variants: {
      size: {
        sm: 'h-3.5 w-6',
        default: 'h-[1.15rem] w-8',
        lg: 'h-5 w-9',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export type SwitchRootVariants = VariantProps<typeof switchRootVariants>;

export const switchThumbVariants = cva(
  'pointer-events-none block rounded-full ring-0 transition-transform data-[state=checked]:bg-switch-thumb-checked data-[state=unchecked]:bg-switch-thumb',
  {
    variants: {
      size: {
        sm: 'size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
        default:
          'size-4 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
        lg: 'size-4.5 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
      },
    },
    defaultVariants: { size: 'default' },
  },
);

export type SwitchThumbVariants = VariantProps<typeof switchThumbVariants>;
