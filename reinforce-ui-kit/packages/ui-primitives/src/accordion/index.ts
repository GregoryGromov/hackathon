export const accordionItemClass =
  'glass glass-link mb-2 rounded-2xl border-0 px-4 last:mb-0 [&::details-content]:h-0 [&::details-content]:overflow-hidden [&[open]::details-content]:h-auto motion-safe:[&::details-content]:[transition:height_var(--motion-duration-standard)_var(--motion-ease-standard),content-visibility_var(--motion-duration-standard)_var(--motion-ease-standard)_allow-discrete]';

export const accordionTriggerClass =
  'focus-ring disabled-state flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-colors outline-none hover:underline [&[data-state=open]>svg]:rotate-180 [details[open]>&>svg]:rotate-180';

export const accordionTriggerIconClass =
  'pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground motion-safe:transition-transform duration-[var(--motion-duration-quick)] ease-[var(--motion-ease-standard)]';

export const accordionContentClass =
  'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down';

export const accordionContentInnerClass = 'pt-0 pb-4';
