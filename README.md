<div align="center">

# Monorepo Template

A production-ready monorepo starter with Turborepo, Vite, TailwindCSS, and a best-in-class DX toolchain.

[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![pnpm](https://img.shields.io/badge/pnpm-8.x-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Biome](https://img.shields.io/badge/Biome-2.x-60A5FA?style=flat-square&logo=biome&logoColor=white)](https://biomejs.dev)
[![Ultracite](https://img.shields.io/badge/Ultracite-7.x-8B5CF6?style=flat-square)](https://ultracite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](./LICENSE)

</div>

---

## Overview

This template gives you a fully wired monorepo with zero boilerplate friction. Everything you need to ship fast — task orchestration, shared configs, typed packages, and a strict-but-ergonomic code quality pipeline — is already configured.

Add a new Vite frontend, a Node.js API, or a shared component library, and they all share the same toolchain out of the box.

---

## Features

- **Turborepo** — intelligent task scheduling with remote caching support
- **pnpm workspaces** — fast, disk-efficient package management across all workspaces
- **Vite** — lightning-fast dev server and build tooling for frontend apps
- **TailwindCSS** — utility-first styling with a shared Prettier sort plugin
- **TypeScript** — strict, project-wide type safety with per-environment tsconfig presets
- **Biome + Ultracite** — zero-config linting and formatting with opinionated React and TanStack presets
- **ESLint** — workspace-level linting with shared flat-config presets (base, Vite, Node)
- **Prettier** — consistent code formatting with TailwindCSS class sorting
- **Husky** — pre-commit hooks to catch issues before they land in git
- **Shared configs** — single source of truth for ESLint, TypeScript, and Prettier across every workspace

---

## Folder Structure

```
monorepo-template/
├── apps/                          # Deployable applications
│   ├── web/                       # Vite + React frontend (example app)
│   └── api/                       # Node.js REST API (coming soon)
│
├── packages/                      # Shared internal packages
│   └── ui/                        # Reusable React component library
│
├── config/                        # Shared tooling configurations
│   ├── eslint-config/
│   │   ├── base.js                # Base ESLint config (TS + Prettier)
│   │   ├── vite.js                # ESLint config for Vite/React apps
│   │   └── node.js                # ESLint config for Node.js packages
│   ├── prettier-config/
│   │   └── index.mjs              # Shared Prettier config (+ Tailwind sort)
│   └── typescript-config/
│       ├── base.json              # Base tsconfig (strict, ESNext)
│       ├── vite.json              # tsconfig for Vite frontend apps
│       └── node.json              # tsconfig for Node.js packages
│
├── biome.json                     # Biome linter/formatter config (Ultracite presets)
├── turbo.json                     # Turborepo pipeline definitions
├── pnpm-workspace.yaml            # pnpm workspace declarations
└── package.json                   # Root scripts and dev dependencies
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org) | 20+ |
| [pnpm](https://pnpm.io) | 8+ |

### Installation

```sh
# Clone the template
git clone https://github.com/your-username/monorepo-template.git my-project
cd my-project

# Install all workspace dependencies
pnpm install
```

### Development

```sh
# Start all apps in dev mode (parallel, with Turborepo)
pnpm dev

# Build all apps and packages
pnpm build

# Type-check all workspaces
pnpm check-types
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in watch/dev mode |
| `pnpm build` | Build all apps and packages |
| `pnpm check-types` | Run TypeScript type checks across all workspaces |
| `pnpm check` | Lint and format check (Ultracite / Biome) |
| `pnpm fix` | Auto-fix lint and formatting issues |

> Turborepo caches task outputs automatically. Subsequent builds and type-checks are near-instant when nothing has changed.

---

## Shared Packages

### `@repo/eslint-config`

Flat-config ESLint presets ready to extend:

```js
// eslint.config.js in any workspace
import { config } from "@repo/eslint-config/vite"; // or /base, /node
export default config;
```

### `@repo/typescript-config`

Layered tsconfigs for consistent compiler options:

```json
// tsconfig.json in any workspace
{ "extends": "@repo/typescript-config/vite" }
```

### `@repo/prettier-config`

A single Prettier config with TailwindCSS class sorting:

```json
// package.json in any workspace
{ "prettier": "@repo/prettier-config" }
```

---

## Adding a New App

```sh
# Create the app folder inside apps/
mkdir apps/my-app
cd apps/my-app

# Scaffold with Vite (or any other tool)
pnpm create vite . --template react-ts

# Extend the shared configs
# tsconfig.json  →  { "extends": "@repo/typescript-config/vite" }
# eslint.config  →  import { config } from "@repo/eslint-config/vite"
# package.json   →  { "prettier": "@repo/prettier-config" }
```

Turborepo picks up the new workspace automatically — no further root configuration needed.

---

## Adding a New Shared Package

```sh
mkdir packages/my-lib
cd packages/my-lib

# Minimal package.json
cat > package.json <<EOF
{
  "name": "@repo/my-lib",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts"
}
EOF
```

Reference it from any app or package: `"@repo/my-lib": "workspace:*"`.

---

## Code Quality

This template enforces quality at multiple layers:

| Layer | Tool | When |
|-------|------|------|
| Formatting | Biome + Prettier | On save (editor), on commit (Husky) |
| Linting | Biome + ESLint | On save (editor), on commit (Husky) |
| Type safety | TypeScript (strict) | On `check-types`, CI |
| Import order | Biome assist | Automatically organized |
| Pre-commit | Husky | Blocks bad commits locally |

Run `pnpm fix` to auto-resolve all fixable issues before committing.

---

## Roadmap

- [ ] `apps/api` — Node.js REST API with TypeScript and shared config
- [ ] `packages/ui` — Reusable React component library with Storybook
- [ ] Docker / docker-compose setup for the API
- [ ] GitHub Actions CI workflow
- [ ] Remote Turborepo caching configuration

---

## License

[MIT](./LICENSE)
