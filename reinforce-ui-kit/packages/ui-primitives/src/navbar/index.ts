export const navbarHeaderClass = 'fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4 md:pt-5';

export const navbarShellClass =
  'glass-island flex h-14 items-center justify-between gap-3 rounded-full px-4 sm:h-16 sm:gap-4 sm:px-8';

export const navbarBrandClass =
  'focus-ring group flex items-center gap-2 rounded-md transition-colors duration-[var(--motion-duration-quick)] ease-[var(--motion-ease-standard)] hover:text-primary';

export const navbarBrandLogoClass =
  'size-8 shrink-0 transition-[filter] duration-[var(--motion-duration-quick)] ease-[var(--motion-ease-standard)] group-hover:drop-shadow-[0_0_4px_color-mix(in_oklab,var(--primary),transparent_78%)] sm:size-9';

export const navbarBrandTextClass = 'text-xl font-bold tracking-tight sm:text-2xl';

export const navbarLangMenuBaseClass =
  'absolute z-50 w-56 overflow-hidden rounded-2xl border border-border bg-popover p-1 text-popover-foreground shadow-lg';

export const navbarLangMenuScrollClass =
  'max-h-80 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin] [scrollbar-color:color-mix(in_oklab,var(--border),transparent_30%)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40';

export const navbarLangMenuAlignClass = {
  start: 'start-0',
  end: 'end-0',
  'start-md-end': 'start-0 md:end-0 md:start-auto',
} as const;

export const navbarLangMenuDirectionClass = {
  down: 'top-full mt-2',
  up: 'bottom-full mb-2',
} as const;

export type NavbarLangMenuAlign = keyof typeof navbarLangMenuAlignClass;
export type NavbarLangMenuDirection = keyof typeof navbarLangMenuDirectionClass;

export const navbarLangMenuClass = `${navbarLangMenuBaseClass} ${navbarLangMenuAlignClass.end} ${navbarLangMenuDirectionClass.down}`;

export const navbarMobileOverlayClass =
  'fixed inset-0 z-40 bg-overlay supports-[backdrop-filter]:backdrop-blur-sm';

export const navbarMobilePanelClass =
  'fixed inset-0 z-50 flex h-full w-full translate-x-full flex-col bg-popover/85 text-popover-foreground backdrop-blur-xl backdrop-saturate-150 motion-safe:transition-transform motion-safe:duration-[var(--motion-duration-standard)] motion-safe:ease-[var(--motion-ease-standard)]';

export const navbarMobilePanelGlowClass = 'pointer-events-none absolute inset-0 z-0';

export const navbarMobilePanelGlowStyle = [
  'background-image:',
  'radial-gradient(60% 50% at 15% 10%,color-mix(in oklab,var(--primary),transparent 66%),transparent 70%),',
  'radial-gradient(55% 45% at 90% 85%,color-mix(in oklab,var(--primary),transparent 76%),transparent 75%),',
  'radial-gradient(75% 60% at 50% 55%,color-mix(in oklab,var(--primary),transparent 86%),transparent 80%)',
].join('');

export const navbarMobilePanelBodyClass =
  'relative z-10 flex h-full flex-col overflow-y-auto overscroll-contain px-6 py-5 sm:px-8';

export const navbarMobileSectionLabelClass =
  'font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground';

export const navbarMobileNavListClass =
  '-mx-6 flex flex-col divide-y divide-border border-y border-border sm:-mx-8';
