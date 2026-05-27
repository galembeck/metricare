# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

`@metricare/api` — Fastify REST API for the MetriCare healthcare platform.

**Stack:** Fastify 5, Prisma 7 (PostgreSQL via `@prisma/adapter-pg`), Zod 4, JWT (`@fastify/jwt`), Vitest, tsup.

## Commands

```sh
pnpm dev              # tsx watch src/server.ts (loads .env from repo root)
pnpm build            # tsup — outputs to dist/
pnpm start            # node dist/server.js

pnpm test             # vitest run (single pass)
pnpm test:watch       # vitest watch mode
pnpm test:coverage    # vitest with v8 coverage

pnpm db:generate      # prisma generate (must run after schema changes)
pnpm db:migrate       # prisma migrate dev
pnpm db:seed          # prisma db seed (tsx prisma/seed.ts)
pnpm db:studio        # prisma studio UI
```

All `db:*` and `dev` commands load `.env` from the monorepo root via `dotenv-cli`.

## Architecture

### Server bootstrap (`src/server.ts`)

Fastify is instantiated with `ZodTypeProvider`. Validator and serializer compilers from `fastify-type-provider-zod` are set globally — every route's schema/response should use Zod objects. OpenAPI docs (Swagger + Scalar) are auto-generated and served at `/docs`.

Plugins registered: `@fastify/cors`, `@fastify/jwt`, `@fastify/swagger`, `@scalar/fastify-api-reference`.

### Database (`src/lib/prisma.ts`)

A single shared `PrismaClient` instance using the `PrismaPg` driver adapter. Import it as `import { prisma } from '@/lib/prisma'` (or relative path). Query logging is enabled in dev.

### Schema location

`prisma/schema.prisma` — datasource is PostgreSQL. Generated client outputs to `generated/prisma/` (imported as `../../generated/prisma/client.js`). Run `db:generate` whenever the schema changes.

### Auth

JWT via `@fastify/jwt`. The secret comes from `env.JWT_SECRET`. Extend `FastifyRequest` in `src/@types/fastify.d.ts` to add typed user properties from the decoded token.

### Env

All environment access goes through `@metricare/env` (the shared `packages/env` workspace). Never read `process.env` directly; import `env` instead. `@metricare/env` is bundled into the output (`noExternal` in `tsup.config.ts`).

## Build

tsup bundles everything from `src/` with sourcemaps. `@metricare/env` is inlined. Output goes to `dist/`.

## Config inheritance

- TypeScript: extends `@metricare/typescript-config/node`
- ESLint: extends `@metricare/eslint-config/node`
- Prettier: `@metricare/prettier-config`
