# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

`@metricare/typescript-config` — layered tsconfig presets for all workspaces.

## Presets

| File        | Extends  | Use in                              | Key differences                                      |
|-------------|----------|-------------------------------------|------------------------------------------------------|
| `base.json` | —        | Any workspace as a foundation       | `strict`, `ESNext`, `Bundler` module resolution, `isolatedModules` |
| `vite.json` | `base`   | Vite/React apps (`apps/web`)        | Adds `DOM` lib, `react-jsx`, `noEmit`, strict unused checks, `noImplicitReturns` |
| `node.json` | `base`   | Node.js packages (`apps/api`, etc.) | `nodenext` module + resolution, `es2024` target/lib, no `noEmit` |

## Usage

```json
// tsconfig.json in a workspace
{ "extends": "@metricare/typescript-config/vite" }
```

## Notes

- `base.json` has `noUnusedLocals/Parameters: false` — the stricter presets (`vite.json`) re-enable them.
- `node.json` uses `module: "nodenext"` and `moduleResolution: "node16"`, which requires explicit `.js` extensions on relative imports in Node.js ESM code.
