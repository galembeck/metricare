# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

`@metricare/env` — single source of truth for environment variable validation across the monorepo. Built on `@t3-oss/env-nextjs` + Zod 4.

## Declared variables

| Variable               | Schema                        | Side      |
|------------------------|-------------------------------|-----------|
| `PORT`                 | `z.coerce.number()` (def 3333)| server    |
| `DATABASE_URL`         | `z.url()`                     | server    |
| `JWT_SECRET`           | `z.string()`                  | server    |
| `VITE_PUBLIC_API_URL`  | `z.url()`                     | shared    |

`emptyStringAsUndefined: true` — empty strings are treated as missing.

## Usage

```ts
import { env } from '@metricare/env';
env.DATABASE_URL  // typed string
env.PORT          // typed number
```

Accessing an undeclared variable is a TypeScript error. Accessing a declared variable with an invalid runtime value throws at process startup.

## Adding a new variable

1. Add the Zod schema to the appropriate section (`server`, `client`, or `shared`) in `index.ts`.
2. Add the `runtimeEnv` mapping for the new key.
3. Add the variable to `.env.example` at the repo root.
4. Declare it in `turbo.json` pipeline inputs if it's read during a Turbo task (avoids the `turbo/no-undeclared-env-vars` lint warning).
