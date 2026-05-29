# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Overview

MetriCare is a full-stack healthcare application built as a pnpm + Turborepo monorepo.

```
apps/
  web/          # React 19 frontend — Vite, TanStack Router, TanStack Query, Tailwind v4
  api/          # Fastify REST API — Prisma (PostgreSQL), Zod, JWT auth

packages/
  env/          # Shared env validation via @t3-oss/env-nextjs + Zod

config/
  eslint-config/       # Shared ESLint flat-config presets (base / vite / node)
  prettier-config/     # Shared Prettier config (+ tailwindcss class sorting)
  typescript-config/   # Shared tsconfig presets (base / vite / node)
```

## Commands

### Root (runs across all workspaces via Turborepo)

```sh
pnpm dev           # Start all apps in parallel watch mode
pnpm build         # Build all apps and packages
pnpm check-types   # TypeScript type-check all workspaces
pnpm check         # Biome/Ultracite lint + format check
pnpm fix           # Biome/Ultracite auto-fix lint + formatting
```

### API (`apps/api`)

```sh
pnpm dev               # tsx watch with .env loaded
pnpm build             # tsup bundle to dist/
pnpm test              # vitest run (single pass)
pnpm test:watch        # vitest watch
pnpm test:coverage     # vitest coverage

pnpm db:generate       # prisma generate (regenerate client)
pnpm db:migrate        # prisma migrate dev
pnpm db:seed           # prisma db seed
pnpm db:studio         # prisma studio
```

### Web (`apps/web`)

```sh
pnpm dev       # vite dev server
pnpm build     # tsc -b && vite build
pnpm preview   # vite preview
```

## Environment Variables

Copy `.env.example` to `.env` at the monorepo root before running the API. All vars are validated at startup via `@metricare/env`:

| Variable             | Description                          |
|----------------------|--------------------------------------|
| `DATABASE_URL`       | PostgreSQL connection string         |
| `JWT_SECRET`         | Secret for JWT signing               |
| `VITE_PUBLIC_API_URL`| Base URL the frontend calls          |
| `PORT`               | API port (default 3333)              |

The `env:load` script in `apps/api` uses `dotenv-cli` to inject `.env` from the repo root before any command.

## Architecture

### Request flow (API)

`server.ts` bootstraps Fastify with `ZodTypeProvider` — all route schemas are Zod objects that double as OpenAPI specs. Swagger UI is served at `/docs` (Scalar renderer). Auth uses `@fastify/jwt`; extend `FastifyRequest` in `src/@types/fastify.d.ts` to add typed decorators.

### Routing (web)

TanStack Router with file-based routes. Pages live in `src/pages/`; the route tree is auto-generated to `src/route-tree-gen.ts` (do not edit manually). The router token is `layout`, and auto code-splitting is enabled. Use `@/` as the path alias for `src/`.

### Database

Prisma schema at `apps/api/prisma/schema.prisma`. Generated client outputs to `apps/api/generated/prisma/`. The Prisma client in `src/lib/prisma.ts` uses the `@prisma/adapter-pg` driver adapter. Run `db:generate` after every schema change.

### Shared env package

`@metricare/env` exports a single `env` object consumed by both the API and (eventually) the web app. Accessing an undeclared env var anywhere produces a TypeScript error and a runtime throw.

## Code Quality Pipeline

| Layer      | Tool              | Trigger                      |
|------------|-------------------|------------------------------|
| Format     | Biome + Prettier  | `pnpm fix`, Husky pre-commit |
| Lint       | Biome + ESLint    | `pnpm check`, Husky pre-commit |
| Types      | TypeScript strict | `pnpm check-types`, CI       |

Run `pnpm fix` before committing. See `.claude/CLAUDE.md` for the full Ultracite code standards enforced by Biome.

## Adding a New Workspace

- **App**: create under `apps/`, extend `@metricare/typescript-config`, `@metricare/eslint-config`, and `@metricare/prettier-config` — Turborepo picks it up automatically.
- **Package**: create under `packages/` with `"name": "@metricare/<name>"` and reference it as `"workspace:*"` from consumers.
