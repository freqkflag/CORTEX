# WholeLife (Self-Hosted) — GitHub Repository Scaffold

> Copy these files/folders into a fresh repo named `wholelife` (or any name). The scaffold boots a minimal stack: **NestJS API**, **React/Vite PWA**, **Indexer stub**, **Ollama**, **Postgres+pgvector**, **Caddy**, **MinIO**. E2EE hooks are stubbed client-side.

---

## Repository Tree
```
wholelife/
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .npmrc
├── LICENSE
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CODEOWNERS
├── package.json
├── tsconfig.base.json
├── turbo.json
├── .github/
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/bug_report.md
│   ├── ISSUE_TEMPLATE/feature_request.md
│   └── workflows/
│       ├── ci.yml
│       ├── docker-publish.yml
│       └── codeql.yml
├── infra/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   ├── .env.example
│   │   ├── caddy/
│   │   │   └── Caddyfile
│   │   └── db/
│   │       └── init.sql
│   └── scripts/
│       ├── backup.sh
│       └── restore.sh
├── docs/
│   ├── ADR-000-template.md
│   ├── RUNBOOK.md
│   ├── E2EE.md
│   └── ARCHITECTURE.md
├── apps/
│   ├── api/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   └── health.controller.ts
│   │   └── Dockerfile
│   ├── web/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   ├── manifest.webmanifest
│   │   │   └── icons/
│   │   │       └── 192.png
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── api.ts
│   │       ├── crypto/
│   │       │   └── e2ee.ts
│   │       └── styles.css
│   └── indexer/
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   └── main.ts
│       └── Dockerfile
├── packages/
│   ├── sdk-server/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/index.ts
│   └── sdk-client/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/index.ts
└── modules/
    ├── core.tasks/
    │   ├── module.json
    │   ├── migrations/001_init.sql
    │   └── README.md
    ├── core.calendar/
    │   ├── module.json
    │   ├── migrations/001_init.sql
    │   └── README.md
    ├── core.notes/
    │   ├── module.json
    │   ├── migrations/001_init.sql
    │   └── README.md
    └── core.journal/
        ├── module.json
        ├── migrations/001_init.sql
        └── README.md
```

---

## Root Files

### `.editorconfig`
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

### `.gitattributes`
```gitattributes
* text=auto eol=lf
*.sh text eol=lf
*.sql text eol=lf
```

### `.gitignore`
```gitignore
# Node
node_modules/
.pnpm-store/

# Builds
**/dist/
**/.turbo/

# Env
.env
infra/docker/.env
infra/docker/.env.local

# Editor
.vscode/
.idea/

# Logs
logs/
**/*.log
```

### `.npmrc`
```ini
engine-strict=true
fund=false
audit=false
```

### `LICENSE`
```text
MIT License

Copyright (c) 2025 <Your Name>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### `README.md`
```md
# WholeLife (Self‑Hosted)

Privacy‑first, local‑first personal platform with E2EE by default. Modules for tasks, calendar, notes/backlinks, journal, and many life domains. Local LLM assistant via Ollama. See `/docs/ARCHITECTURE.md` and SPEC.

## Quick Start
1. Clone and create `.env` from `infra/docker/.env.example`.
2. `npm i` (Node 22+), then `npm run dev:compose` to boot infra + apps.
3. Visit `https://localhost` (accept self‑signed cert if needed).

## Scripts
- `npm run dev:compose`: start Docker stack (db, minio, ollama, api, web, indexer, caddy).
- `npm run build`: build all workspaces.
- `npm run test`: run tests.
- `npm run lint`: lint repo.

## Security
E2EE by default. Keys never leave your devices. See `/docs/E2EE.md` and `/SECURITY.md`.

## License
MIT
```

### `SECURITY.md`
```md
# Security Policy

- **E2EE by default**: server stores ciphertext for sensitive fields.
- Report issues via GitHub issues or email <security@yourdomain>.
- Please do not include secrets or personal data in reports.
```

### `CONTRIBUTING.md`
```md
# Contributing

- Use Node 22+, npm workspaces.
- Conventional commits (`feat:`, `fix:`, `docs:`...).
- PRs require tests and docs updates.
```

### `CODE_OF_CONDUCT.md`
```md
# Contributor Covenant Code of Conduct

We pledge to make participation a harassment‑free experience. Be kind, assume good intent, no harassment.
```

### `CODEOWNERS`
```text
* @your-github-handle
```

### `package.json`
```json
{
  "name": "wholelife",
  "private": true,
  "engines": { "node": ">=22" },
  "workspaces": ["apps/*", "packages/*", "modules/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "dev:compose": "docker compose -f infra/docker/docker-compose.yml --env-file infra/docker/.env up --build"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "turbo": "^2.0.6"
  }
}
```

### `tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["node"]
  }
}
```

### `turbo.json`
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false },
    "lint": { },
    "test": { }
  }
}
```

---

## .github

### `.github/dependabot.yml`
```yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### `.github/pull_request_template.md`
```md
## Summary

## Changes

## Testing

## Screenshots

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated
```

### `.github/ISSUE_TEMPLATE/bug_report.md`
```md
---
name: Bug report
about: Create a report to help us improve
labels: bug
---

**Describe the bug**

**To Reproduce**

**Expected behavior**

**Logs / Screenshots**

**Environment**
```

### `.github/ISSUE_TEMPLATE/feature_request.md`
```md
---
name: Feature request
about: Suggest an idea
labels: enhancement
---

**Problem**

**Proposal**

**Alternatives**
```

### `.github/workflows/ci.yml`
```yml
name: CI
on:
  pull_request:
  push:
    branches: [ main ]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

### `.github/workflows/docker-publish.yml`
```yml
name: Docker Publish
on:
  workflow_dispatch:
  push:
    tags: [ 'v*.*.*' ]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/api/Dockerfile
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/wholelife-api:${{ github.ref_name }}
```

### `.github/workflows/codeql.yml`
```yml
name: "CodeQL"
on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
jobs:
  analyze:
    permissions:
      actions: read
      contents: read
      security-events: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript
      - uses: github/codeql-action/analyze@v3
```

---

## Infrastructure

### `infra/docker/docker-compose.yml`
```yml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: wholelife
      POSTGRES_USER: wholelife
      POSTGRES_PASSWORD: change-me
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/10_pgvector.sql:ro
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "wholelife"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio12345
    ports: ["9000:9000", "9001:9001"]
    volumes:
      - minio_data:/data

  ollama:
    image: ollama/ollama:latest
    ports: ["11434:11434"]
    volumes:
      - ollama_data:/root/.ollama

  indexer:
    build: ../../apps/indexer
    env_file: .env
    depends_on: [db, ollama]

  app:
    build: ../../apps/api
    env_file: .env
    environment:
      DATABASE_URL: postgresql://wholelife:change-me@db:5432/wholelife
      OLLAMA_URL: http://ollama:11434
    depends_on: [db]

  web:
    build: ../../apps/web
    env_file: .env
    depends_on: [app]

  caddy:
    image: caddy:latest
    ports: ["80:80", "443:443"]
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on: [web, app]

volumes:
  db_data: {}
  minio_data: {}
  caddy_data: {}
  caddy_config: {}
  ollama_data: {}
```

### `infra/docker/.env.example`
```env
APP_DOMAIN=localhost
APP_URL=https://localhost
JWT_SECRET=replace-me
S3_ENDPOINT=http://minio:9000
S3_BUCKET=wholelife
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio12345
S3_REGION=us-east-1
S3_FORCE_PATH_STYLE=true
CHAT_MODEL=llama3.1:8b-instruct-q4_0
EMBED_MODEL=bge-m3
STORAGE_DRIVER=local   # local | s3
FILES_DIR=/data/files
```

### `infra/docker/caddy/Caddyfile`
```caddy
{$APP_DOMAIN} {
  encode zstd gzip
  reverse_proxy /api* app:3000
  reverse_proxy /chat* app:3000
  reverse_proxy / web:4173
  header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
  tls internal
}
```

### `infra/docker/db/init.sql`
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### `infra/scripts/backup.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date +%F)
BACKUP_DIR="backups/$STAMP"
mkdir -p "$BACKUP_DIR"
docker compose -f infra/docker/docker-compose.yml exec -T db pg_dump -U wholelife wholelife > "$BACKUP_DIR/db.sql"
echo "Backup complete: $BACKUP_DIR"
```

### `infra/scripts/restore.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
STAMP=${1:?Usage: restore.sh YYYY-MM-DD}
BACKUP_DIR="backups/$STAMP"
cat "$BACKUP_DIR/db.sql" | docker compose -f infra/docker/docker-compose.yml exec -T db psql -U wholelife -d wholelife
echo "Restore complete from: $BACKUP_DIR"
```

---

## Docs

### `docs/ADR-000-template.md`
```md
# ADR-000: Title
Date: YYYY-MM-DD
Status: Proposed
Context → Decision → Consequences
```

### `docs/RUNBOOK.md`
```md
# Runbook
- Start: `npm run dev:compose`
- Logs: `docker compose -f infra/docker/docker-compose.yml logs -f app`
- Backups: `infra/scripts/backup.sh`
- Restore: `infra/scripts/restore.sh 2025-10-05`
```

### `docs/E2EE.md`
```md
# E2EE Overview
Client-only master key → collection keys → row DEKs. Blind indexes for equality filters. Server stores ciphertext; client handles crypto.
```

### `docs/ARCHITECTURE.md`
```md
# Architecture Summary
Modular monolith API (NestJS) + PWA + indexer + Ollama + Postgres/pgvector + MinIO. See SPEC for detailed schemas and PlantUML.
```

---

## Apps — API (NestJS on Fastify)

### `apps/api/package.json`
```json
{
  "name": "wholelife-api",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "dev": "node --watch --loader ts-node/esm src/main.ts",
    "start": "node dist/main.js",
    "lint": "echo 'lint stub'",
    "test": "echo 'test stub'"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-fastify": "^11.0.0",
    "fastify": "^4.28.1"
  },
  "devDependencies": {
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  }
}
```

### `apps/api/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist" },
  "include": ["src/**/*"]
}
```

### `apps/api/nest-cli.json`
```json
{ "collection": "@nestjs/schematics", "sourceRoot": "src" }
```

### `apps/api/src/main.ts`
```ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';

const PORT = Number(process.env.PORT || 3000);

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  await app.listen({ port: PORT, host: '0.0.0.0' });
}
bootstrap();
```

### `apps/api/src/app.module.ts`
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthController } from './health.controller.js';

@Module({
  controllers: [AppController, HealthController],
  providers: [AppService]
})
export class AppModule {}
```

### `apps/api/src/app.controller.ts`
```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  hello() { return { ok: true, name: 'wholelife-api' }; }
}
```

### `apps/api/src/app.service.ts`
```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {}
```

### `apps/api/src/health.controller.ts`
```ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  status() { return { status: 'ok', time: new Date().toISOString() }; }
}
```

### `apps/api/Dockerfile`
```Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ../../tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
RUN npm i --omit=dev -w apps/api || true

FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm i && npm run -w apps/api build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

---

## Apps — Web (React/Vite PWA)

### `apps/web/package.json`
```json
{
  "name": "wholelife-web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview -p 4173",
    "lint": "echo 'lint stub'",
    "test": "echo 'test stub'"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "vite": "^5.4.8",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0"
  }
}
```

### `apps/web/tsconfig.json`
```json
{ "extends": "../../tsconfig.base.json", "include": ["src", "vite.config.ts"] }
```

### `apps/web/vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], server: { host: true } })
```

### `apps/web/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="manifest" href="/public/manifest.webmanifest">
    <title>WholeLife</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `apps/web/public/manifest.webmanifest`
```json
{ "name": "WholeLife", "short_name": "WholeLife", "start_url": "/", "display": "standalone", "icons": [{"src":"/public/icons/192.png","sizes":"192x192","type":"image/png"}] }
```

### `apps/web/src/main.tsx`
```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
createRoot(document.getElementById('root')!).render(<App />)
```

### `apps/web/src/App.tsx`
```tsx
export default function App(){
  return (
    <div style={{padding:16,fontFamily:'ui-sans-serif'}}>
      <h1>WholeLife</h1>
      <p>Welcome. API health check: <code>/api/health</code></p>
    </div>
  )
}
```

### `apps/web/src/api.ts`
```ts
export const apiBase = (import.meta.env.VITE_API_URL ?? '/api') as string
export async function health(){
  const res = await fetch(`${apiBase}/health`); return res.json()
}
```

### `apps/web/src/crypto/e2ee.ts`
```ts
// Placeholder for client E2EE utilities (libsodium)
export function encryptPlaceholder(data: unknown){ return new TextEncoder().encode(JSON.stringify(data)) }
export function decryptPlaceholder(buf: Uint8Array){ return JSON.parse(new TextDecoder().decode(buf)) }
```

### `apps/web/src/styles.css`
```css
html,body,#root{height:100%} body{margin:0}
```

---

## Apps — Indexer (stub)

### `apps/indexer/package.json`
```json
{
  "name": "wholelife-indexer",
  "private": true,
  "type": "module",
  "scripts": { "dev": "node --watch src/main.ts", "start": "node dist/main.js", "build": "tsc -p tsconfig.json" },
  "dependencies": { },
  "devDependencies": { "typescript": "^5.6.3" }
}
```

### `apps/indexer/tsconfig.json`
```json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "outDir": "dist" }, "include": ["src/**/*"] }
```

### `apps/indexer/src/main.ts`
```ts
console.log('Indexer stub online. Connect to DB & Ollama when ready.')
setInterval(()=>{}, 1<<30)
```

### `apps/indexer/Dockerfile`
```Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm i && npm run build
CMD ["node","dist/main.js"]
```

---

## Packages — SDKs (stubs)

### `packages/sdk-server/package.json`
```json
{ "name": "@wholelife/sdk-server", "version": "0.0.1", "type": "module", "main": "dist/index.js", "scripts": { "build": "tsc -p tsconfig.json" }, "devDependencies": { "typescript": "^5.6.3" } }
```

### `packages/sdk-server/tsconfig.json`
```json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "outDir": "dist" }, "include": ["src/**/*"] }
```

### `packages/sdk-server/src/index.ts`
```ts
export interface ModuleManifest { name: string; version: string }
```

### `packages/sdk-client/package.json`
```json
{ "name": "@wholelife/sdk-client", "version": "0.0.1", "type": "module", "main": "dist/index.js", "scripts": { "build": "tsc -p tsconfig.json" }, "devDependencies": { "typescript": "^5.6.3" } }
```

### `packages/sdk-client/tsconfig.json`
```json
{ "extends": "../../tsconfig.base.json", "compilerOptions": { "outDir": "dist" }, "include": ["src/**/*"] }
```

### `packages/sdk-client/src/index.ts`
```ts
export const hello = () => 'hello from client sdk'
```

---

## Modules — Core schema stubs

### `modules/core.tasks/module.json`
```json
{ "name": "core.tasks", "version": "0.1.0", "migrations": ["migrations/001_init.sql"], "api": { "routes": [] }, "ui": { "nav": [{"label":"Tasks","path":"/tasks"}] } }
```

### `modules/core.tasks/migrations/001_init.sql`
```sql
CREATE TYPE core_task_status AS ENUM ('todo','doing','done','blocked','canceled');
CREATE TABLE core_task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description_md TEXT,
  status core_task_status NOT NULL DEFAULT 'todo',
  priority SMALLINT DEFAULT 3,
  due_at TIMESTAMPTZ,
  recur_rrule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `modules/core.calendar/module.json`
```json
{ "name": "core.calendar", "version": "0.1.0", "migrations": ["migrations/001_init.sql"], "ui": { "nav": [{"label":"Calendar","path":"/calendar"}] } }
```

### `modules/core.calendar/migrations/001_init.sql`
```sql
CREATE TABLE core_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL,
  location TEXT,
  recur_rrule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `modules/core.notes/module.json`
```json
{ "name": "core.notes", "version": "0.1.0", "migrations": ["migrations/001_init.sql"], "ui": { "nav": [{"label":"Notes","path":"/notes"}] } }
```

### `modules/core.notes/migrations/001_init.sql`
```sql
CREATE TABLE core_note (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content_md TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE core_link (
  id BIGSERIAL PRIMARY KEY,
  src_type TEXT NOT NULL,
  src_id UUID NOT NULL,
  tgt_type TEXT NOT NULL,
  tgt_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `modules/core.journal/module.json`
```json
{ "name": "core.journal", "version": "0.1.0", "migrations": ["migrations/001_init.sql"], "ui": { "nav": [{"label":"Journal","path":"/journal"}] } }
```

### `modules/core.journal/migrations/001_init.sql`
```sql
CREATE TABLE core_journal_entry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  content_md TEXT,
  mood SMALLINT,
  energy SMALLINT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `modules/**/README.md`
```md
# Module
Describe purpose and DB changes. UI nav path and routes registered here.
```

---

## Next Steps
1. Create a new GitHub repo and copy this scaffold.
2. Replace `LICENSE` copyright holder.
3. Wire Postgres connection + migrations in `apps/api` (e.g., via Prisma/Drizzle/Knex) and mount module migrations.
4. Implement E2EE client lib (libsodium) and replace placeholder crypto.
5. Flesh out API routes and PWA pages per SPEC.
```

