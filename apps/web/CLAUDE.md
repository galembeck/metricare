# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

`@metricare/web` — React 19 single-page application for the MetriCare healthcare platform.

**Stack:** Vite 8, React 19, TanStack Router (file-based), TanStack Query, Tailwind CSS v4, TypeScript 6.

## Commands

```sh
pnpm dev       # vite dev server (hot reload)
pnpm build     # tsc -b && vite build
pnpm preview   # preview production build locally
pnpm lint      # eslint
```

## Routing

Routes are file-based under `src/pages/`. TanStack Router auto-generates `src/route-tree-gen.ts` — never edit that file by hand.

- `__root.tsx` is the root layout (wraps all routes with `<Outlet />`).
- The `routeToken` is `layout`, so a file named `_layout.tsx` defines a layout wrapper for its directory.
- Auto code-splitting is on: each route is a separate chunk automatically.
- Type-safe navigation is available everywhere via the module augmentation in `src/app.tsx`.

## Path alias

`@/` resolves to `src/`. Use it for all non-relative imports within the app.

## Data fetching

TanStack Query (`QueryClientProvider` in `app.tsx`) is the data-fetching layer. Default config: `staleTime: 5 min`, `retry: 1`. Use `useQuery` / `useMutation` in route components; avoid `useEffect` for data fetching.

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed. Classes are sorted automatically by `prettier-plugin-tailwindcss` on format.

## React Compiler

Babel + `babel-plugin-react-compiler` (`reactCompilerPreset`) is enabled via the Vite config. Do not add manual `useMemo`/`useCallback` — the compiler handles memoization.

## Config inheritance

- TypeScript: extends `@metricare/typescript-config/vite`
- ESLint: extends `@metricare/eslint-config/vite`
- Prettier: `@metricare/prettier-config`
