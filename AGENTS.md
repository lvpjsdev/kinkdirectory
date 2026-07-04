# AGENTS.md

## What this is

Vue 3 SPA for creating and sharing kink preference lists. 100% client-side — no backend, no accounts, all data in browser localStorage.

## Tech stack

- **Vue 3** + Composition API (`<script setup>`)
- **Nuxt UI v3** (as Vite plugin, NOT as a Nuxt app — no SSR)
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, not PostCSS)
- **TypeScript** — strict mode enabled
- **vue-i18n** for translations
- **VueUse** for composables (`useStorage`, `createGlobalState`, etc.)
- **Vite 6** with `@vitejs/plugin-vue`
- **ESLint** with `@antfu/eslint-config`

## Dev commands

- `yarn dev` — start dev server (Vite)
- `yarn build` — production build to `dist/`
- `yarn typecheck` — type-check only (`vue-tsc --noEmit -p tsconfig.app.json`)
- `yarn lint` / `yarn lint:fix` — ESLint (uses flat config)
- `yarn release` — release via `release-it` (bumps version, builds, creates GitHub release)

There are no tests.

## Project structure

```
src/
  main.ts              — app entry, mounts Vue with i18n + NuxtUI plugin
  App.vue              — root, handles URL ?list= param for shared lists
  style.css            — just `@import "tailwindcss"; @import "@nuxt/ui";`
  data/kinks.ts        — all kink definitions (categories, IDs, keys, formats)
  types/index.ts       — KinkChoice, UserRole, KinkDefinition, KinkList, etc.
  composables/         — useKinkList.ts (core state), useKinkListMigration.ts, useScreenshot.ts, useSettings.ts
  components/          — KinkListView.vue (main), kinklist/* (subcomponents)
  i18n/index.ts        — vue-i18n setup, imports all locales
  locales/*.json       — translation files (nl.json is the source of truth)
  locales-csv/         — CSV exports for translation workflow
  scripts/             — standalone helper scripts (separate package.json, run with tsx)
```

## Localization workflow

- **Source language is Dutch (`nl.json`)**. Write all user-facing strings there.
- Other languages are auto-translated from Dutch using `json-autotranslate`.
- `yarn translate` runs the auto-translate (uses a config in `402.json`, gitignored).
- Translation keys use dot notation. Kink names live under `kinks.<category>.<kink_id>`.
- When adding a new kink, add its translation key to `nl.json` first, then run translate.
- ESLint ignores `src/locales/**` and `src/scripts/**`.

## Kink data model

- Kinks are defined in `src/data/kinks.ts` as `KinkCategory[]`.
- Each kink has a numeric `key` (used in URL encoding) and a `format` (`general` or `role_specific`).
- `role_specific` kinks have `allowedPerspectives` defining which role+perspective combos see them.
- Selections are stored as `"key%position"` → `KinkChoice` (0-6) in localStorage.
- URL encoding uses a compact binary format (base64) for shared lists.

## Communication

- **Use Russian** when communicating with the user. Code comments, commit messages, and PR descriptions stay in English.

## Key conventions

- **No hardcoded strings** — always use `t('key')` from vue-i18n.
- **NuxtUI components are auto-imported** (UModal, UButton, etc.) — no explicit imports needed. See `components.d.ts` for the full list.
- **VueUse composables are auto-imported** — `useStorage`, `createGlobalState`, etc.
- **Use `function` keyword** for pure functions (not arrow functions for top-level functions).
- **Prefer interfaces over types** for extendability.
- **Mobile-first responsive design** via Tailwind.
- **Data is private** — nothing is sent to any server. localStorage only.

## Gotchas

- NuxtUI is used as a **Vite plugin**, not a Nuxt module. There is no `nuxt.config`. The app is a plain Vite + Vue SPA.
- The `src/scripts/` directory has its own `package.json` and deps — it's excluded from typechecking and linting.
- `auto-imports.d.ts` and `components.d.ts` are generated files (gitignored) — do not edit manually.
- `vite.config.ts` sets `base: '/kinkdirectory'` — this is a GitHub Pages deployment.
- The `402.json` config (for auto-translate) is gitignored.
- Release workflow: `release-it` bumps version, runs `yarn build` as a hook, then creates a GitHub release.
- CI deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.
