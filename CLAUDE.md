# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

spec-snake is a Design Docs Generator - a full-stack application for generating AI-powered design documents through interactive scenarios and forms. It combines a CLI tool, Hono server, and React UI with real-time SSE streaming for preview generation.

## Key Commands

```bash
# Development
pnpm dev                            # Start Vite dev server with Hono API (uses examples/local/spec-snake.config.ts)
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
  - `src/server/usecases/docs/generate-doc.ts` - Claude Agent SDK integration with SSE streaming
- `src/client/` - React app with TanStack Router (file-based routing in routes/)
  - `src/client/locales/` - i18n translation files (.po files, .ts compiled)
  - `src/client/features/` - Feature modules:
    - `form/` - Form components (FieldRenderer, GroupFieldRenderer, RepeatableFieldRenderer, Input, Select, Checkbox, Textarea) and services
    - `step/` - Step UI (StepSection, MobileDrawer, StepAside, StepNavigation, StepProgress) and stores
    - `docs/` - Document handling (preview, mutations, queries)
    - `scenario/` - Scenario queries
    - `snackbar/` - Toast notifications
- `src/types.ts` - Core type definitions (Config, Scenario, Step, Field types)
- `src/schema.ts` - Valibot validation schemas
- `src/definitions.ts` - Re-exports from types.ts and schema.ts
- `examples/` - Sample config directories for development (`local/`, `docker/`)
- `vite.config.ts` - Vite configuration with @hono/vite-dev-server integration

### Tech Stack

- **Runtime**: Node.js, pnpm 10.26.2
- **Frontend**: React 19, TanStack Router, Zustand, React Query, react-hook-form, Tailwind CSS 4, @base-ui/react, motion
- **Backend**: Hono with @hono/node-server, @hono/vite-dev-server for development
- **Build**: Vite 7.3, esbuild for CLI bundling
- **i18n**: Lingui (Japanese source, English translation)
- **AI**: @anthropic-ai/claude-agent-sdk for document generation with SSE streaming
- **Config Loading**: jiti for TypeScript/JavaScript config files (CJS/ESM compatible)

### Key Patterns

**Server API Routes** (src/server/apps/):

- `GET /api/scenarios` - List scenarios
- `GET /api/scenarios/:scenarioId` - Get scenario with form defaults
- `GET /api/scenarios/:scenarioId/docs` - List documents for scenario
- `POST /api/scenarios/:scenarioId/docs/preview` - Generate preview via SSE streaming
- `POST /api/scenarios/:scenarioId/docs` - Save document
- `GET/PUT /api/scenarios/:scenarioId/docs/:filename` - Document CRUD

**SSE Streaming** (ChatGPT-like real-time preview):

- Server: Uses Hono's `streamSSE()` with `generateDesignDocStream()` async generator
- Client: `usePreviewDocMutation` reads `ReadableStream` and parses SSE events
- Events: `text_delta` (incremental text), `done` (final content)
- UI: Shows blinking cursor during generation, progressive content rendering

**Client State**:

- Zustand stores in `features/*/stores/` for step form, docs, snackbar, step-aside
- React Query for data fetching (queries/) and mutations (mutations/)
- Session storage persistence for form data

**Config-Driven Design**:

- Users define scenarios in config.ts with steps, prompts, hooks
- `defineScenario()` and `defineConfig()` helpers for type-safe configuration
- `onPreview`/`onSave` hooks for custom behavior
- `filename` for custom document naming
- Prompt is a function receiving `{ formData, aiContext }` parameters
- `InferFormDataFromSteps<T>` utility type for type-safe formData access

**Field Types**:

- `input` - Text input (supports text, date, url types, suggestions)
- `textarea` - Multi-line text
- `select` - Dropdown with options
- `checkbox` - Boolean toggle
- `grid` - Layout for arranging fields in columns
- `repeatable` - Layout for repeating fields (single field or group)
- `group` - Visual grouping of fields (used inside repeatable for multiple fields per entry)

**Conditional Field Display** (`when` property):

- Object form: `{ field: 'priority', is: 'high' }`, `{ field: 'priority', isNot: 'low' }`, `{ field: 'title', isEmpty: true }`, `{ field: 'title', isNotEmpty: true }`
- Function form: `(formData) => formData.priority === 'high' && formData.type === 'feature'`
- Hidden fields are excluded from validation and form submission

**Step Structure**:

- `Step` has `name` and `fields` directly (no `section` wrapper)
- `name` is used as the key in formData
- `fields` is an array of Field types (form fields and layouts)

### File Conventions

- Route components use `-PageName.tsx` prefix (e.g., `-EditDocPage.tsx`)
- Generated files: `routeTree.gen.ts`, `client/locales/*.ts` (don't edit manually)
- Documents stored as .md with YAML frontmatter in scenario's outputDir
- Feature modules: `components/`, `stores/`, `queries/`, `mutations/`

## Code Quality

- **Linting**: Biome with single quotes, 2-space indent, semicolons
- **Types**: Strict TypeScript, validate configs with Valibot at runtime
- **Null checks**: Use `== null` / `!= null` instead of `!variable` or `!!variable`
- **No test framework** currently - relies on type checking and linting
- **Comments**: English only in code, including prompts in config files
