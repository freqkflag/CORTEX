# CORTEX SPEC (MVP Scaffold)

## 1. Purpose & Principles
- Build a self-hosted, privacy-first personal hub covering notes with backlinks, tasks (RRULE aware), calendar events, journal, and modular domains.
- Enforce end-to-end encryption (E2EE) by default: sensitive content is encrypted client-side and the server only stores ciphertext.
- Prefer local compute (Ollama/local models); server-side or cloud compute is opt-in via the `Consented-Compute: allowed` header.
- Keep logs, prompts, and tooling free of plaintext sensitive data. Record identifiers, timestamps, statuses only.

## 2. High-Level Architecture (Target)
- **API (`apps/api`)**: NestJS on Node 22+, Fastify adapter, backed by PostgreSQL 17 with `pgvector`. Responsible for CRUD, search, storage abstraction, and assistant tooling endpoints.
- **Database**: PostgreSQL with Drizzle ORM migrations. Stores core entities plus encrypted overlays. Uses `pgcrypto` for UUID generation and `vector` extension for embeddings.
- **Storage**: Abstraction offering Local filesystem and S3/MinIO drivers. Local driver is content-addressed by SHA-256 and tracks byte size and checksum.
- **Web App (`apps/web`, planned)**: React + Vite PWA with offline-first IndexedDB queue, command palette, unified search. Handles client-side encryption/decryption.
- **Assistant**: Local LLM orchestrated workflows that call API tools. Respects privacy banner and per-action consent.
- **Infrastructure**: Docker Compose stack including API, web, Postgres, MinIO, Ollama, indexer, proxy (Caddy). Health/readiness routes and nightly backup workflows planned.

## 3. Repository Layout (current vs planned)
- `apps/api`: Drizzle schema and repository layer already implemented.
- `apps/web`, `packages/*`, `modules/*`, `docs/*`, `infra/*`: referenced in roadmap; to be populated as prompts are executed.
- Root scripts: npm workspaces orchestrate database commands via `npm run db:generate` / `npm run db:migrate`.
- CI: `.github/workflows/ci.yml` installs dependencies, runs lint/build/test across all workspaces, and warns on non-Conventional commits.

## 4. Backend Data Model (implemented)
All tables live in `public` schema; migrations exist in `apps/api/drizzle`.
- `core_note`: UUID id, optional title, required Markdown content, timestamps.
- `core_link`: Backlink table with `src_*` and `tgt_*` identifiers; bigint primary key.
- `core_task`: Tasks with status enum (`todo|doing|done|blocked|canceled`), priority, optional RRULE and due date.
- `core_event`: Events with timezone-aware start/end, optional location, recurrence rule, freeform description.
- `core_journal_entry`: Daily journal entries with optional mood/energy (smallint) and tags array.
- `core_tag` & `core_tag_map`: Tag catalog with unique slug and mapping join table (`tag_id`, `entity_type`, `entity_id`).
- `core_prop`: Flexible metadata/value store with explicit `is_encrypted` flag.
- `core_file`: File metadata storing storage driver, key, filename, mime, byte size, checksum.
- `core_attachment`: Join table linking files to entities.
- `core_embedding`: Vector store for entity embeddings; default 1536 dims.

### Planned Extensions
- `core_e2ee_payload` and `core_e2ee_index` overlay tables for encrypted payload storage and blind index search.
- Additional domain tables (health, finance, etc.) introduced via modular migrations in `modules/*`.

## 5. Backend Services (implemented scaffolds)
- Repository classes in `apps/api/src/db/repositories.ts` encapsulate Drizzle queries for notes, links, tasks, events, journal entries, tags, props, files, attachments, embeddings.
- Models exported from `apps/api/src/db/models.ts` provide TypeScript types for repositories and future service layers.
- Drizzle configuration (`apps/api/drizzle.config.ts`) loads `.env` / `.env.local`, ensures `DATABASE_URL`, and writes migrations to `apps/api/drizzle`.

## 6. API Surface (to be built per prompts)
- REST namespaces under `/api/v1/...` for notes, tasks, events, journal, files, search, chat.
- Notes must parse wiki-style `[[Title or id:UUID]]` links and furnish backlinks.
- Tasks endpoints manage recurrence expansion; Events enforce ICS-compatible validation and exporter.
- Journal writes coordinate with E2EE payload table transactionally.
- Files endpoints integrate with `StorageService` and enforce streaming, integrity check endpoint, and client-side encryption policy.
- Search endpoint combines text + vector results gated by `Consented-Compute`.
- Chat endpoint loads system prompts in `apps/api/prompts/` and exposes tool stubs (`createTask`, `createEvent`, `createNote`).

## 7. Frontend & Offline Strategy (planned)
- React/Vite PWA with left nav (Notes, Tasks, Calendar, Journal), command palette, global search.
- Service worker via Workbox for precache and runtime caching.
- IndexedDB write queue for offline mutations with reconnect replay and in-UI sync indicator.
- Client E2EE library built atop `libsodium-wrappers`: key derivation (`keys.ts`), payload encryption (`payload.ts`), blind index hashing (`blind-index.ts`).
- UI components respect privacy banner and never send plaintext to server.

## 8. Assistant & Tooling Requirements
- System prompts stored in `apps/api/prompts/` with privacy banner prefix.
- Orchestrator returns JSON plan objects limited to two tool calls unless user consents to more.
- Tool handlers log ids/timestamps only.
- Consented Compute toggles advanced retrieval (vector suggestions, server-side search).
- Refusal policy for decrypted content requests or key sharing.

## 9. Security & Privacy Posture
- Default logging policy: structured JSON logs with redacted request/response bodies; include ids, status codes, durations.
- Rate limits and auth: device-bound refresh tokens, per-IP limiting on auth and file endpoints (planned).
- Threat modeling documented in `docs/THREAT-MODEL.md` (to be added) covering STRIDE analysis, E2EE, key backup, server compromise, consented compute.
- Backups run via nightly GitHub Action storing `pg_dump` artifacts for seven days (private).

## 10. Development Workflow
- Use npm workspaces; Node 22+ required.
- Drizzle workflow:
  1. Edit schema in `apps/api/src/db/schema.ts`.
  2. Run `npm run db:generate`.
  3. Review generated SQL under `apps/api/drizzle/`.
  4. Apply with `npm run db:migrate`.
- Testing strategy (pending implementation):
  - Unit tests for backlink parsing, RRULE expansion (DST), E2EE crypto helpers, blind indexes, storage drivers.
  - Integration tests with Testcontainers (Postgres) for core flows.
  - Playwright E2E for daily workflows.
- CI requires lint/build/test across workspaces; add coverage as features land.

## 11. Documentation & Runbooks (planned)
- `docs/ARCHITECTURE.md`: expand with PlantUML diagrams, schema snippets, component interactions.
- `docs/RUNBOOK.md`: include start/stop procedures, logging, backups, restores, key management.
- `docs/ACCEPTANCE.md`: scripted demo coverage.
- `CHANGELOG.md` for release notes following Conventional Commits.

## 12. Roadmap Alignment
- Follow `prompts.md` (Codex Prompt Pack) sequentially to flesh out functionality.
- Keep diffs focused; update tests and docs alongside code changes.
- Respect guardrails: max two clarifying questions, prefer client compute, never persist plaintext.
