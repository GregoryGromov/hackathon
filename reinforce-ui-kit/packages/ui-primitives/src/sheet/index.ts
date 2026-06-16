import { cva, type VariantProps } from 'class-variance-authority';

export const sheetOverlayClass =
  'fixed inset-0 z-50 bg-overlay supports-[backdrop-filter]:backdrop-blur-sm duration-[var(--motion-duration-standard)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0';

export const sheetContentVariants = cva(
  'glass-strong fixed z-50 flex flex-col gap-4 data-[state=closed]:animate-out data-[state=closed]:duration-[var(--motion-duration-standard)] data-[state=closed]:ease-[var(--motion-ease-standard)] data-[state=open]:animate-in data-[state=open]:duration-[var(--motion-duration-elevated)] data-[state=open]:ease-[var(--motion-ease-emphasized)]',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 h-auto data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        right:
          'inset-y-0 right-0 h-full w-3/4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
        bottom:
          'inset-x-0 bottom-0 h-auto data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

export type SheetContentVariants = VariantProps<typeof sheetContentVariants>;

export const sheetCloseClass =
  'focus-ring disabled-state absolute top-4 right-4 rounded-md opacity-70 transition-opacity hover:opacity-100 data-[state=open]:bg-secondary';

export const sheetHeaderClass = 'flex flex-col gap-1.5 p-4';

export const sheetFooterClass = 'mt-auto flex flex-col gap-2 p-4';

export const sheetTitleClass = 'font-semibold text-foreground';

export const sheetDescriptionClass = 'text-sm text-muted-foreground';
