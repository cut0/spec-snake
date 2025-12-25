# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

spec-snake is a Design Docs Generator - a full-stack application for generating AI-powered design documents through interactive scenarios and forms. It combines a CLI tool, Hono server, and React UI.

## Key Commands

```bash
# Development
pnpm dev                            # Start Vite dev server with Hono API (uses examples/spec-snake.ts)
pnpm build:client                   # Build client assets

# Quality
pnpm typecheck                      # TypeScript type checking
pnpm lint:check                     # Biome linting
pnpm lint:fix                       # Auto-fix linting issues

# i18n
pnpm i18n                           # Extract + compile translations
pnpm i18n:extract                   # Extract translatable strings
pnpm i18n:compile                   # Compile .po files to .ts

# Build & Release
pnpm build                          # Build CLI + types + client (tsc + esbuild + vite)
pnpm release                        # Changesets publish
```

## Architecture

### Directory Structure

- `src/cli/` - CLI commands (citty-based): init, start
- `src/server/` - Hono API server with apps (scenarios, docs), repositories, usecases
  - `src/server/dev.ts` - Vite dev server entry (uses `SPEC_SNAKE_CONFIG` env var)
- `src/client/` - React app with TanStack Router (file-based routing in routes/)
  - `src/client/locales/` - i18n translation files
- `src/types.ts` - Core type definitions (Config, Scenario, Section, Field types)
- `src/schema.ts` - Valibot validation schemas
- `examples/` - Sample config files for development
- `vite.config.ts` - Vite configuration with @hono/vite-dev-server integration

### Tech Stack

- **Runtime**: Node.js, pnpm 10.26.2
- **Frontend**: React 19, TanStack Router, Zustand, React Query, react-hook-form, Tailwind CSS 4
- **Backend**: Hono with @hono/node-server, @hono/vite-dev-server for development
- **Build**: Vite 7, esbuild for CLI bundling
- **i18n**: Lingui (Japanese source, English translation)
- **AI**: @anthropic-ai/claude-agent-sdk for document generation
- **Config Loading**: jiti for TypeScript/JavaScript config files (CJS/ESM compatible)

### Key Patterns

**Server API Routes** (src/server/apps/):

- `GET /api/scenarios` - List scenarios
- `GET /api/scenarios/:scenarioId` - Get scenario with form defaults
- `POST /api/scenarios/:scenarioId/docs/preview` - Generate preview via Claude
- `POST /api/scenarios/:scenarioId/docs` - Generate and save document
- `GET/PUT /api/scenarios/:scenarioId/docs/:filename` - Document CRUD

**Client State**:

- Zustand stores in `features/*/stores/` for step form, docs, snackbar
- React Query for data fetching (queries/) and mutations (mutations/)

**Config-Driven Design**:

- Users define scenarios in config.ts with steps, prompts, hooks
- `onPreview`/`onSave` hooks for custom behavior
- `overrides.filename` for custom document naming
- `{{INPUT_JSON}}` in prompts gets replaced with transformed form data

### File Conventions

- Route components use `-PageName.tsx` prefix (e.g., `-EditDocPage.tsx`)
- Generated files: `routeTree.gen.ts`, `client/locales/*.ts` (don't edit manually)
- Documents stored as .md with YAML frontmatter in scenario's outputDir

## Code Quality

- **Linting**: Biome with single quotes, 2-space indent, semicolons
- **Types**: Strict TypeScript, validate configs with Valibot at runtime
- **Null checks**: Use `== null` / `!= null` instead of `!variable` or `!!variable`
- **No test framework** currently - relies on type checking and linting
