# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

`@metricare/eslint-config` — shared ESLint flat-config presets consumed by every workspace in the monorepo.

## Presets

| File       | Use in                        | Key additions over base               |
|------------|-------------------------------|---------------------------------------|
| `base.js`  | Generic TS packages           | `typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-turbo` |
| `vite.js`  | Vite/React apps (`apps/web`)  | Same as base (currently identical — extend here for React rules)     |
| `node.js`  | Node.js apps/packages (`apps/api`) | Legacy config format; `@typescript-eslint`, `prettier` |

All rules are downgraded to **warnings** via `eslint-plugin-only-warn` (base/vite presets) so they never block the build.

`eslint-plugin-turbo` enforces `turbo/no-undeclared-env-vars` — add new env vars to `turbo.json` pipeline inputs if the lint rule fires.

## Usage in a workspace

```js
// eslint.config.js (flat config)
import { config } from '@metricare/eslint-config/vite'; // or /base, /node
export default config;

// or via package.json eslintConfig field (legacy)
{ "eslintConfig": { "extends": ["@metricare/eslint-config/node"] } }
```

## Extending a preset

Import the exported `config` array and spread it, then append your overrides:

```js
import { config } from '@metricare/eslint-config/base';
export default [...config, { rules: { 'my-rule': 'error' } }];
```
