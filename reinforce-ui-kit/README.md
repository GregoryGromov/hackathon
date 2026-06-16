# reinforce-ui-kit workspace

This directory was reduced to the shared UI kit extracted from the original `reinforce-web` monorepo.

Remaining packages:

- `packages/ui-tokens`
- `packages/ui-styles`
- `packages/ui-primitives`
- `packages/ui-react`
- `packages/tsconfig`

The root workspace config was also narrowed to those packages only. `pnpm-lock.yaml` may still contain historical entries from the original monorepo until the next `pnpm install`.
