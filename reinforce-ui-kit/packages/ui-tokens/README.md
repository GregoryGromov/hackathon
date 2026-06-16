# @reinforce/ui-tokens

Framework-agnostic CSS tokens. shadcn-compatible semantic surface + glass/glow/backdrop extensions.

## Five invariants

| Rule | Why |
|---|---|
| **Token surface mirrors `npx shadcn@latest init` for Tailwind v4 exactly** — customize *values*, not *set* | Trim shadcn defaults break shadcn CLI compat (`add component` write refs to vars not exist). Add non-shadcn vars force every consumer know our private set. Status (`--success*`/`--warning*`) **only** explicit exception — tone API need surface shadcn no ship. |
| **Brand-role split**: `--primary = blue` (CTA, focus ring, switch-on, caret, selection); `--accent = amber` (Radix menu focus, glass halo, `--chart-2`) | One token per semantic role — components write `bg-primary text-primary-foreground`, not `bg-blue-500`. Swap brand color = one token change. Mix roles ("accent for CTAs sometimes") destroy discipline. |
| Amber foreground = **warm near-black** `oklch(0.20 0.04 70)` (light) / `oklch(0.18 0.04 70)` (dark), NOT white | White-on-amber fail WCAG AA 4.5:1. Warm-black on amber sit above bar + match temperature of amber surface — cool-black read as color clash. |
| **Dark standalone, not inverted light** — own `--primary = blue-500` w/ white foreground, `--accent = amber-400` (brighter ring), colored halo via `color-mix(primary, transparent 65%)` | Invert OKLCH palette no produce usable dark theme — luminances need re-tune, contrast ratios re-check, halo glows re-color (black halo invisible in dark). Dark get own `.dark` block; shared structure = var *names*, not values. |
| **Semantic dark tokens** (`--input-bg`, `--switch-track-checked`, etc.) live in tokens, not components | Components write `bg-input-bg`; never hardcode `dark:bg-input/30`. Dark-mode variants in component class strings scatter theme; centralize as tokens = re-skin is tokens-only PR. |

## Slices

- `./palette.css` — primitive OKLCH scales 50–950 for `neutral`, `blue`, `danger`, `amber`. **Components must never reference `--palette-*` directly** — always go through semantic token. Palette = brand-color source of truth; semantic tokens map onto it.
- `./theme.css` — canonical shadcn semantic set on `:root` / `.dark`. Standard shadcn vars (`--background`, `--card*`, `--primary*`, etc.) + status extension (`--success*`/`--warning*` + ring colors) + glass/glow/backdrop tokens + surface/shadow tokens + semantic dark tokens.

## Why warning hue ≈ 50 distinct from accent hue ≈ 70

Both amber-family. 20° hue separation make warning surface (orange-lean) read distinct from brand CTA (true amber). Without separation, `[data-tone="warning"]` panel look like misclicked primary action — wrong affordance.

## What NOT to add

- `--tertiary` — three brand colors one too many for coherent system.
- `--surface-*` clamps — surface tinting via `color-mix` against existing tokens more flexible.
- `--text-*` clamps — Tailwind v4 ship `text-xs..text-9xl`; reimplement as tokens duplicate without gain.

Non-shadcn extensions: `--success`/`--warning` (tone API, shadcn no ship), plus design-system families — `--radius-{control,island,card,pill}`, `--motion-duration-*`/`--motion-ease-*`, `--elevation-*`, `--surface-tint-*`, `--accent-soft*`, `--glow-*`. Customize *values*, not the *set*.