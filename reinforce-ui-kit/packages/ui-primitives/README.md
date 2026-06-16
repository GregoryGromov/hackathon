# @reinforce/ui-primitives + UI kit conventions (П1–П10)

shadcn `new-york-v4` on Tailwind v4 / React 19, split so same component ships styles-only into Astro, full React into apps. Folder-per-slice, subpath-only exports — **no root barrel**.

## Packages

- **`@reinforce/ui-primitives`** — framework-agnostic styling. Exports (1) `cva` recipes where semantic axis remain (`buttonVariants` — `default | destructive | secondary | outline | ghost | ghost-destructive | link`, all but `link` on single hero-CTA visual; `badgeVariants`, `alertVariants`, `tabsListVariants`, `toggleVariants`, `navigationMenuTriggerStyle`, `navLinkVariants` (`desktop | mobile` — quiet nav text-link, not button), `sheetContentVariants`, `scrollAreaScrollbarVariants`, plus size/interactive-only recipes for card/input/textarea/select-trigger/checkbox/radio-group-item/switch/progress/tabs-trigger, plus `headingVariants`/`textVariants`); (2) plain `xxxClass` constants per slot (accordion item, dialog/popover/tooltip content, command root/item, table container/row, skeleton, inline-code, `navbar` shell/brand/mobile-sheet slots, …). **Every visual class string live here, not in `ui-react`.** **Glass — default; opt-in `variant: 'glass*'` dropped.** Subpath per component. (`collapsible` only `data-slot` wiring — live only in `ui-react`.) Astro use: `<a class={buttonVariants({ variant: 'outline' })}>` zero-JS.

- **`@reinforce/ui-react`** — full shadcn kit (33 components) on umbrella `radix-ui` (`import { Slot, Dialog, ... } from "radix-ui"`). Tailwind v4 patterns: no `forwardRef`, `data-slot` on every primitive, `data-variant`/`data-size` for variant styling, `Slot.Root` for `asChild`. `cn` from `@reinforce/ui-styles/cn`. **Every component import class strings from `ui-primitives`** — React layer = radix behavior + `data-*` + `cn(primitiveClass, className)`. Subpath per component, no barrel, no `default` export. Cross-slice import via subpath alias (`@reinforce/ui-react/dialog`), never relative `../X/index.tsx` (TS5097 / `allowImportingTsExtensions` off).

### Primitives-only exceptions (no `ui-react` twin)

- **`nav-link` + `navbar`** — primitives-first navigation surface for non-React consumers. Add a React layer only when there is an actual consumer.
- **`comparison-table`** — primitives-only comparison surface. Slots: `comparisonTableContainerClass`/`comparisonTableScrollContainerClass`/`comparisonTableHighlightOverlayClass`/`comparisonTableStickyLabelClass` + `comparisonTableCellVariants` (`role: label | head | body`)/`comparisonTableDotVariants` (`state: filled | filled-highlight | empty` × `size: sm | md`)/`comparisonTableValueVariants` (`size: sm | md` × `highlight: boolean`). Architecture — flat CSS Grid: consumer set column-template, each cell get explicit `grid-column`/`grid-row` (overlay in highlight column with `grid-row: 1 / span totalRows`, else break auto-placement). Highlight = single grid-item overlay (`comparisonTableHighlightOverlayClass` — `pointer-events-none ring-inset ring-primary/30 bg-primary/10`, overlay carry `grid-column` + `grid-row: 1 / -1`), not `border-x` per cell — remove "segmented staircase" on dark theme. Tint light>dark (`bg-primary/16` light / `bg-primary/10` dark): dark theme already read accent, weak tint lost on light bg. Mobile scroll wrapper carry `mask-image` right fade-edge; sticky-label get shadow. Row-hover — consumer wrap each row in `<div class="contents group/row">`: wrapper transparent for grid layout, give hover zone, `group-hover/row:*` from `comparisonTableCellVariants` highlight every cell in row.

## Adding components

Use shadcn CLI against `packages/ui-react/components.json` (aliases `utils → @reinforce/ui-styles/cn`):

```bash
mise exec -- pnpm dlx shadcn@latest add <name> --cwd packages/ui-react
```

CLI drop files under `src/components/ui/<name>.tsx`. **Move into folder-per-slice form** (`src/<name>/index.tsx`), add `package.json#exports` entry, then **extract every class string into `packages/ui-primitives/src/<name>/index.ts`** (`cva` as `xxxVariants`, inline strings as `xxxClass`). Replace inline strings in `ui-react` with imports. **No pre-emptive re-implement shadcn components.**

`useSortedClasses` (Biome nursery) **off** for `packages/ui-{primitives,react}/src/**` — shadcn dictate class order.

## Typography (Heading / Text / InlineCode)

Standardized scale live as cva-recipes in `@reinforce/ui-primitives/typography`, React sugar in `@reinforce/ui-react/typography` — same recipe both ways, **identical visual output between dapp and landing**.

- Astro: `<h1 class={headingVariants({ level: 'display' })}>`, `<p class={textVariants({ variant: 'lead' })}>`, `<code class={inlineCodeClass}>`.
- dapp: `<Heading level="display">`, `<Text variant="lead">`, `<InlineCode>`. Polymorphism via `asChild` + `Slot.Root`. **No separate `as` prop.**

`headingVariants.level`: `display | h1 | h1-compact | h2` (border-bottom for documentary docs) `| h3 | h4 | h5 | h6`. `textVariants.variant`: `lead | subtitle | body | small | muted | mono | numeric | numeric-amount | numeric-display | numeric-hero | numeric-hero-unit`. Defaults: `Heading.level = h1`, `Text.variant = body`. `h1-compact` — h1 one step smaller (`text-3xl`/`lg:text-4xl`), `subtitle` — `lead` one step smaller (`text-base`/`md:text-lg`); both non-semantic size-tokens, like `display`.

**No `.ty-*` utilities or custom `--text-*` tokens** — Tailwind v4 built-in `text-xs..text-9xl` foundation. **Exception**: `display` (heading) + `numeric-{amount,display,hero,hero-unit}` (text) — only roles with fluid `[font-size:clamp(...)]`. `numeric-hero`/`numeric-hero-unit` scale by **container** (`cqi`) for `@container` hero stats (transparency proof big ratio + unit); the rest scale by viewport (`vw`). Any other arbitrary `font-size` (incl. clamp) forbidden — extend kit, not call-site.

**Display roles = strong signal, use sparingly.** Reserved for brand moments: page hero, top-line balance on dashboard, success state after operation ("Bridged $12,408"). **No use** in header chips (`chip-glass-ghost` + `Text variant="numeric"`), table cells, list rows, portfolio cards — standard `numeric` (text-sm) and plain `h1..h6`. Bug-fix invariant: Plex Condensed load up to weight 700, so `display` use `font-bold` (not `font-extrabold` — else browser synthesize bold).

## Consumer rule — reuse, don't reinvent

Kit — **single source of truth** for the visual layer in consumer apps:

- **Kit slot exist → use it.** `<Card>` / `<Button>` / `<Tabs>` from `@reinforce/ui-react/<slot>`; Astro consume class strings / cva recipes from `@reinforce/ui-primitives/<slot>` direct. Inline construct `<div className="rounded-2xl bg-card/80 backdrop-blur ...">` for surface — drift; use `<Card>`.
- **Slot / variant missing → extend kit, not call-site.** New `cva` arm in `ui-primitives/<slot>`, mirror-prop in `ui-react/<slot>` → consume. dapp and Astro landing inherit one definition auto.
- **No re-derived class strings.** П1–П7 (radii / hover / focus / disabled / transitions / sizes / glass-tier) — kit-owned. Inline `motion-safe:hover:-translate-y-0.5 transition-all duration-200` outside kit slot = drift; either kit recipe already cover it, or recipe need new arm.
- **Semantic tokens over hardcode.** `bg-input-bg`, `text-muted-foreground`, `ring-ring` — never `dark:bg-zinc-800/30`, never raw hex. Missing semantics — extend `@reinforce/ui-tokens`, not local call site.
- **Apply to Astro and React equal.** Single-source recipes yield identical visual output between dapp and landing (see typography section above).

When extending the kit, keep a local consumer showcase or fixture in sync.

## Conventions (П1–П10)

Standardization contract, mandatory for every edit under `ui-{tokens,styles,primitives,react}`.

- **П1. Radii** — `rounded-md`: inline controls (input/textarea/select-trigger/toggle), table cell, menu/select/command items, dialog/sheet close, button `link`. `rounded-lg`: tabs trigger — concentric to `tabs list` `rounded-xl` with `p-1` (rule `inner = outer − padding`; recompute when list radius/padding change). `rounded-xl`: tabs list, tooltip, **shell-islands** (sidebar and header via `glass-island`; flush to viewport, `rounded-2xl` look adrift). `rounded-2xl`: **all** floating surfaces (dialog, sheet content, popover, hover-card, dropdown/select content, command root, nav-menu viewport) **and all glass containers** (card, alert, accordion item, table container). `rounded-full`: **all buttons except `link`**, badge, avatar, switch, progress, radio item. `rounded-xs`/`rounded-3xl` forbidden.
- **П2. Hover** — utilities in `effects/index.css` (`.glass-hover`, `.glass-soft-hover`, `.glass-link`, `.hover-glass-tint`, `.link-underline-slide`). Buttons: lift apply only to CTA variants (`default | destructive | secondary | outline`) — `transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-[0.5px]`. Colored halo live in `:hover` blocks of `.btn-cta-*` (brightness 1.06 + tinted box-shadow + inset highlight via `--surface-tint-strong`). **`ghost` / `ghost-destructive` no lift** — ghost by role "no chrome", motion in dense lists look jittery without halo to justify. `link` also no lift. Icon sizes (`icon | icon-xs | icon-sm | icon-lg`) override base lift to `scale-105` via compound variant — work for all variants incl. ghost. Inline `hover:bg-primary/90` kept only in solid-`badge` (shadcn idiom). **No new one-off hover strings.**
- **П3. Focus** — `focus-ring` (= `outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50`), destructive — `focus-ring-destructive`. Items inside dropdown/select/command keep `focus:bg-accent focus:text-accent-foreground` (Radix keyboard nav).
- **П4. Disabled** — `disabled-state` (native controls, `disabled:` API) or `disabled-data-state` (Radix items, `data-[disabled]` API). `disabled:cursor-not-allowed` forbidden.
- **П5. Transitions** — `transition-colors` (text/bg/border on hover/focus), `transition-[color,box-shadow]` (controls with focus-ring), `transition-opacity` (fade), `transition-all` (only surface effects with translate). Duration `duration-200` (exception: state-driven slide in sheet/dialog/tooltip).
- **П6. Size scale** — `size: 'sm' | 'default' | 'lg'`. button/input/textarea/select-trigger/toggle: `h-8/h-9/h-10`. tabs trigger: `h-7 px-2 / h-8 px-2.5 / h-9 px-3`. checkbox/radio item: `size-3.5/size-4/size-5`. switch: `h-3.5 w-6 / h-[1.15rem] w-8 / h-5 w-9`. badge: `h-5/h-6/h-7`. card: `gap-4 py-4 / gap-6 py-6 / gap-8 py-8` (+ headerVariants/contentVariants/footerVariants). progress: `h-1/h-2/h-3`. dialog: `max-w-sm p-4 / max-w-lg p-6 / max-w-2xl p-8`. button extra `xs` (`h-6`) and icon variants `icon | icon-xs | icon-sm | icon-lg` (`size-9/size-6/size-8/size-10`) — only allowed extension.
- **П7. Glass coverage — DEFAULT for surface/floating.** Tier mapping:
  - `glass-island` (`rounded-xl`, inset highlight + primary-tint halo) — **shell islands**: sticky sidebar and header islands.
  - `chip-glass-ghost` (white pill in `btn-cta-ghost` language — gradient + inset highlight + neutral drop-shadow + hover-lift) — **info chips in header** (TRUSD balance etc.).
  - `glass-strong` (`rounded-2xl`, tooltip — `rounded-xl`) — floating.
  - `glass` (`rounded-2xl`) — surface containers (card, alert, accordion item, table container).
  - `glass-weak` — inline controls (input, textarea, select-trigger, checkbox, radio item, switch root, toggle/tabs-list default, progress root).
  - `skeleton-shimmer` — placeholder bars (foreground-tinted flat base, no glass: on light theme `glass-weak` no contrast with tinted backdrop, visibility degrade to invisible).
  - Buttons — hero-CTA: 4 CTA variants (`default | destructive | secondary | outline`) share base lift physics, color in rest gradient and hover-halo (`.btn-cta` / `.btn-cta-secondary` / `.btn-cta-destructive` / `.btn-cta-ghost`); `ghost` / `ghost-destructive` — `.btn-ghost-soft` / `.btn-ghost-destructive` no lift (list-row / unobtrusive); `link` text-only. Aria-invalid and destructive focus use `ring-ring-destructive` (NOT `ring-destructive/20 dark:ring-destructive/40` — these hardcodes dropped). Badges solid (chip legibility). Variant API for glass dropped. `sonner` (`.toast-glass`) — glass-island parity + accent-chip icon; variant via `--toast-accent` (success/info → primary, warning → accent, error → destructive); no `richColors` — accent itself carry semantics.
- **П8. Dark — semantic tokens over hardcode.** `--input-bg` / `--input-bg-hover` / `--switch-track{,-checked}` / `--switch-thumb{,-checked}` declared in `ui-tokens/theme/index.css` (`:root` + `.dark`) and exposed via `@theme inline`. Use `bg-input-bg` — **no** hardcode `dark:bg-input/30`.
- **П9. Motion-safe** — all `transform` effects wrapped in `motion-safe:` or live in CSS utility with `@media (prefers-reduced-motion: reduce)` (pattern from `.glass-hover`). Button press — via `motion-press`.
- **П10. Floating rhythm** — `dialog` size variants with different padding (П6). list-style content (`dropdown-menu`, `select`, `command items`) — `p-1`. prose-style (`popover`, `hover-card`) — `p-4`. `tooltip` — `px-3 py-1.5`. `sheet content` — `p-6`.

Maintain a dedicated design-system showcase in the consuming app. When adding a variant or size, extend that showcase too.

## Accordion on native `<details>`

`accordion` rows carry **two interaction contracts**: Radix `data-[state=open]` (for `ui-react`) and native `<details>`/`<summary>` (for zero-JS Astro). Selectors of one contract inert against other's markup (`[details[open]…]`/`::details-content` no match Radix div markup; `data-state` no match native), so adding native branch backward-compatible.

Astro markup:

```astro
<details class={accordionItemClass} name="faq">
  <summary class={accordionTriggerClass}>
    Вопрос
    <svg class={accordionTriggerIconClass}><!-- chevron --></svg>
  </summary>
  <div class={accordionContentInnerClass}>Ответ</div>
</details>
```

- `accordionItemClass` (on `<details>`) animate height via `::details-content` (pseudo-element belong to `<details>`, not child `div`). Require `interpolate-size: allow-keywords` on `:root` at consumer — without it `<details>` toggle instant (graceful degradation), content always work.
- `accordionTriggerClass` (on `<summary>`) rotate icon via `[details[open]>&>svg]`.
- `accordionContentClass` not need for native `<details>` — wrap content direct in `accordionContentInnerClass`.
- Single-open group — native `name` attribute on `<details>`, no script.

## Table density (Astro vs React)

`data-density="compact|default|comfortable"` on container with `data-slot="table-container"` overrides header height and cell padding. Default `default` (`h-10` / `p-2`); `compact` = `h-8` / `0.375rem 0.5rem`; `comfortable` = `h-12` / `0.75rem`. React wrapper (`<Table density="..." />`) forward attribute auto — in Astro attribute written by hand. CSS selectors duplicated: catch both per-cell `data-slot="table-head|table-cell"` (React) and bare `th`/`td` (Astro).
