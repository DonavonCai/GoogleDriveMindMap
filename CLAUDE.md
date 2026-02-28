# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GoogleDriveMindMap** — a full-stack web application that visualizes Google Drive file structures as a mind map.

## Technology Stack

- **Client** (`client/`): React 19, Vite 6, TypeScript 5.7, Vitest 3
- **Server** (`server/`): Express 5, TypeScript 5.7, tsx (dev runner)
- **Shared** (`shared/`): TypeScript types consumed by both client and server
- **Tooling**: ESLint 9 (flat config), Prettier 3, npm workspaces, concurrently

## Commands

```bash
# Install all dependencies (run from root — single command covers all workspaces)
npm install

# Start both dev servers concurrently (client: 5173, server: 3001)
npm run dev

# Type check all packages via project references
npm run typecheck

# Run frontend tests (Vitest)
npm test

# Lint all packages
npm run lint

# Format all files
npm run format

# Check formatting without writing
npm run format:check

# Build all packages for production
npm run build
```

## Architecture

```
client/ (port 5173)  →  /api/*  →  server/ (port 3001)
                              ↑
                       shared/types.ts
```

- **`shared/types.ts`** — single source of truth for domain types: `DriveItem`, `ApiResponse<T>`, `HealthCheckResponse`
- **`server/src/index.ts`** — Express app entry point (port 3001)
- **`server/src/routes/health.ts`** — `GET /api/health`
- **`server/src/routes/items.ts`** — `GET /api/items`
- **`client/src/components/ItemsList.tsx`** — fetches `/api/items` and renders the drive item list
- **Vite dev proxy**: all `/api/*` requests from the client are forwarded to `localhost:3001`

## Key Design Decisions

- **`shared/` exports raw TypeScript source** (`main: "./types.ts"`). Both `tsx` (server dev) and Vite (client) transpile it directly — no separate build step for shared during development.
- **Server uses `module: CommonJS`** for clean Express 5 integration without `.js` extension requirements on imports.
- **Client uses `module: ESNext` + `moduleResolution: Bundler`** as required by Vite.
- **TypeScript project references** (`tsc --build` from root) compile all three packages in dependency order: shared → server & client.
- **ESLint 9 flat config**: server uses `eslint.config.mjs` (explicit ESM extension, since server has no `"type":"module"`); client uses `eslint.config.js` (client has `"type":"module"`).
- **Vitest config** lives inside `vite.config.ts` (`test:` block) so it inherits Vite plugins automatically.
- **`@testing-library/jest-dom`** is imported in `client/vitest.setup.ts` to extend Vitest's `expect` with DOM matchers like `toBeInTheDocument`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Returns `{ success: true, data: { status: 'ok', timestamp: string } }` |
| GET | `/api/items` | Returns `{ success: true, data: DriveItem[] }` |

## Ports

| Service | Port |
|---------|------|
| Client dev server (Vite) | 5173 |
| Backend (Express) | 3001 |
