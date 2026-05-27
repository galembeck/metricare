# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

`@metricare/prettier-config` — single shared Prettier config for all workspaces.

## Key settings

- `printWidth: 120`, `tabWidth: 2`, spaces (no tabs)
- `singleQuote: true`, `jsxSingleQuote: false`
- `trailingComma: "es5"`, `arrowParens: "always"`
- `prettier-plugin-tailwindcss` — auto-sorts Tailwind class strings on format

## Usage

```json
// package.json in any workspace
{ "prettier": "@metricare/prettier-config" }
```

Run `pnpm fix` from the repo root to format all workspaces.
