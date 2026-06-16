export const tableContainerClass = 'glass relative w-full overflow-x-auto rounded-2xl';

export const tableClass = 'w-full caption-bottom text-sm';

export const tableHeaderClass = '[&_tr]:border-b';

export const tableBodyClass = '[&_tr:last-child]:border-0';

export const tableFooterClass = 'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0';

export const tableRowClass =
  'hover-glass-tint border-b data-[state=selected]:bg-primary/15 has-aria-expanded:bg-primary/10';

export const tableHeadClass =
  'h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]';

export const tableCellClass =
  'whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]';

export const tableCaptionClass = 'mt-4 text-sm text-muted-foreground';
