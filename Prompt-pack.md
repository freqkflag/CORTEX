# CORTEX — Codex Prompt Pack (Build v1)

This file collects short, copyable prompts to drive Codex (or a similar AI code assistant) to build the **first working version** of CORTEX. Use them in order or cherry‑pick. Each prompt:
- states intent, constraints, and acceptance criteria
- assumes the scaffold from this repo
- keeps **E2EE by default** and never logs plaintext

> Tip: open a new branch per feature using `dev-unit-{feature}-{date}-{time}`.

---

## 0) Repo hygiene & conventions

**Prompt A0 — Initialize work branch and checklist**
> Create a new branch named `dev-unit-bootstrap-{date}-{time}`. Summarize the bootstrap steps you will take. Confirm Node 22+, Docker, and Compose. Do not make code changes yet. Output a numbered plan.

**Prompt A1 — Enforce project conventions in CI**
> Update `.github/workflows/ci.yml` to run `npm ci`, `npm run lint`, `npm run build`, and `npm test` for all workspaces. Ensure Node 22. Fail PRs if any step fails.

**Prompt A2 — Conventional commits PR gate**
> Add a lightweight commit message check in CI that warns (not fails) when commits are not Conventional Commits. Update `CONTRIBUTING.md` with examples.

---

## 1) Database & migrations

**Prompt DB1 — Introduce a migration tool**
> Add **Drizzle ORM** (or Prisma if you prefer) to `apps/api` for Postgres 17. Configure a migrations folder `apps/api/drizzle` and a script `npm run db:migrate`. Output the exact commands to generate and run migrations in dev.

**Prompt DB2 — Core tables**
> Generate migrations for the core tables from SPEC: `core_note`, `core_link`, `core_task` (with enum status), `core_event`, `core_journal_entry`, `core_tag`, `core_tag_map`, `core_prop`, and `core_file`/`core_attachment`, plus `core_embedding` using `pgvector`. Create TypeScript models and repository services. Acceptance: `db:migrate` succeeds and tables exist.

**Prompt DB3 — E2EE overlay tables**
> Add `core_e2ee_payload(entity_type, entity_id, rev, nonce, ciphertext, created_at, updated_at, pk)` and `core_e2ee_index(entity_type, entity_id, field, token_hash, pk)`. Prepare typed accessors that read/write payloads transactionally with base entities.

---

## 2) Storage drivers (local + S3/MinIO)

**Prompt S1 — Abstraction**
> Implement `StorageService` in `apps/api` with two drivers: Local and S3 (MinIO). Config via env `STORAGE_DRIVER`, `FILES_DIR`, `S3_*`. Methods: `put(stream, mime) → file_id`, `get(file_id)`, `delete(file_id)`. Write unit tests with temporary directories and MinIO container in CI.

**Prompt S2 — Content‑addressed paths**
> Change Local driver to store files at `/sha256/aa/bb/<hash>`. Store `sha256` and `bytes` in `core_file`. Add integrity check endpoint `GET /api/v1/files/:id/check` returning `{ ok, bytes, sha256 }`.

---

## 3) API (NestJS/Fastify)

**Prompt API1 — Bootstrap v1 routes**
> Create versioned routes: `/api/v1/notes`, `/tasks`, `/events`, `/journal`, `/files`, `/search`, `/chat`. Use DTO validation, typed responses, and Fastify reply schemas. Add a global error filter that redacts sensitive fields.

**Prompt API2 — CRUD Notes with backlinks**
> Implement POST/GET/PATCH/DELETE for Notes. Parse wiki links `[[Title or id:UUID]]` and update `core_link`. Add `GET /api/v1/notes/:id/backlinks`. Unit tests for linking multiple entity types.

**Prompt API3 — Tasks**
> Implement Task endpoints with fields from schema, including `recur_rrule`. Add helper to expand the next N occurrences server‑side for non‑E2EE metadata only. Tests across DST boundaries.

**Prompt API4 — Events (ICS‑compatible)**
> Implement Event endpoints with timezone handling. Ensure `starts_at < ends_at` and `timezone` is valid IANA. Add exporter: `GET /api/v1/events.ics` for a date range.

**Prompt API5 — Journal**
> Implement Journal CRUD with `entry_date`, mood, energy. Ensure E2EE payload write is transactional.

**Prompt API6 — Files**
> Implement `POST /files` (multipart), `GET /files/:id` (stream), and `DELETE /files/:id`. Ensure E2EE option encrypts client‑side; server must not decrypt. Add `Content-Disposition` headers.

**Prompt API7 — Hybrid search endpoint**
> Implement `GET /api/v1/search?q=...` that performs full‑text on titles (tsvector) and returns vector suggestions only if client includes a `Consented-Compute: allowed` header. For E2EE, return instructions to the client to run local search.

---

## 4) PWA (React/Vite) — offline & E2EE hooks

**Prompt WEB1 — Project shell**
> Create the app shell with a left nav (Notes, Tasks, Calendar, Journal), a global command palette, and a unified search input. Add a service worker with Workbox for precache and a small runtime cache.

**Prompt WEB2 — IndexedDB queue**
> Implement an IndexedDB write queue for offline mutations. On reconnect, replay in order with exponential backoff. Visible status indicator in the header.

**Prompt WEB3 — E2EE client lib (scaffold)**
> Add `libsodium-wrappers` and implement `keys.ts` (MK/CK/DEK derivation), `payload.ts` (encrypt/decrypt JSON), and `blind-index.ts` (HMAC then SHA‑256). Provide a key backup/restore UI mock. Do **not** send keys to server.

**Prompt WEB4 — Notes UI**
> Build Notes list, editor (Markdown), and backlinks pane. Support wiki link autocomplete. E2EE: store note content as encrypted payload; title may be null or a redacted placeholder.

**Prompt WEB5 — Tasks UI**
> Build a simple kanban (Todo/Doing/Done) plus a “Today” view. Create/complete tasks, set due dates and RRULE. Link to notes.

**Prompt WEB6 — Calendar UI**
> Monthly/weekly agenda view; show Events and Task occurrences.

**Prompt WEB7 — Journal UI**
> Daily entry editor with mood/energy sliders, tag chips, and attachments.

---

## 5) Indexer + LLM (Ollama + LlamaIndex)

**Prompt IDX1 — Indexer service**
> In `apps/indexer`, connect to Postgres and watch for changes to core entities (poll `updated_at` for now). For non‑E2EE or Consented Compute, chunk Markdown, build embeddings with the configured model via Ollama, and upsert into `core_embedding`.

**Prompt IDX2 — Local assistant endpoint**
> In `apps/api`, add `POST /api/v1/chat` that proxies to Ollama with a system prompt explaining E2EE constraints. Allow optional MCP tools later. Stream responses.

**Prompt IDX3 — Retrieval helper**
> Add a retrieval helper that, given a query, (a) if E2EE strict: instructs the client to run local search, else (b) queries vector store and returns top‑k snippets.

---

## 6) Plugin system

**Prompt PLUG1 — Module loader**
> Implement a module loader that scans `/modules/*/module.json`, applies SQL migrations, mounts API routes, and registers UI contributions in a `/api/v1/modules/manifest` endpoint consumed by the PWA.

**Prompt PLUG2 — Example Health & Finances modules**
> Add minimal API routers for Health and Finances per thin‑slice spec. Ensure sensitive values are only in E2EE payloads; metadata tables keep dates and ids for filtering.

---

## 7) Automations & reminders

**Prompt AUTO1 — Event bus**
> Implement a lightweight in‑process EventBus with events `NoteCreated/Updated`, `TaskCreated/Updated`, `JournalCreated`, `FileUploaded`. Provide a dev log subscriber that prints **only ids and timestamps**.

**Prompt AUTO2 — Rules engine (MVP)**
> Add a rules table with `on_event`, `condition_json`, and `action_json`. Actions supported: create task, create event, link entities. Add an API `POST /api/v1/rules/test` for dry‑runs.

---

## 8) Import/Export

**Prompt IO1 — Importers**
> Implement client‑side importers for Markdown notes, CSV tasks/transactions, and ICS events. Parse locally, encrypt payloads, and batch POST to API.

**Prompt IO2 — Bulk export**
> Implement `GET /api/v1/export.zip` that streams a ZIP with Markdown/CSV/ICS plus attachments, but **never** decrypts E2EE payloads.

---

## 9) Security & privacy

**Prompt SEC1 — Logging policy**
> Add a logger that defaults to JSON. Redact all potential PII fields. Ensure request/response logs only include ids, timestamps, and status codes. Document the policy in `SECURITY.md`.

**Prompt SEC2 — Rate limits**
> Add basic auth middleware with device‑bound refresh tokens and per‑ip rate limiting on auth and file endpoints.

**Prompt SEC3 — Threat model doc**
> Create `docs/THREAT-MODEL.md` covering E2EE, key backup, server compromise, and Consented Compute. Include STRIDE checklist.

---

## 10) Observability & ops

**Prompt OPS1 — Health & readiness**
> Add `/api/health` (already present) and `/api/ready` that checks DB connectivity and storage driver. Ensure Caddy routes `/api/*` correctly.

**Prompt OPS2 — Backups in CI**
> Add a GitHub Action workflow that, on a nightly schedule, runs `pg_dump` inside the db container and stores the artifact for 7 days (private repo).

---

## 11) Tests

**Prompt TEST1 — Unit**
> Add unit tests for: backlink parsing, RRULE expansion (DST), E2EE encrypt/decrypt, blind index token generation, and StorageService.

**Prompt TEST2 — Integration**
> Spin Postgres in Testcontainers for API integration tests. Cover Notes→Task linking, Journal write with E2EE payload, and File upload.

**Prompt TEST3 — E2E**
> Add Playwright tests for: create daily note → backlink → create task → schedule event → add journal entry → verify appears in Today and Calendar.

---

## 12) Docker & dev UX

**Prompt DOCK1 — Compose polish**
> Update `infra/docker/docker-compose.yml` with named networks, healthchecks for app and web, and dependency order. Ensure `caddy` waits for `web` and `app`.

**Prompt DOCK2 — Makefile**
> Add a root `Makefile` with `make up`, `make down`, `make logs`, `make db-migrate`, and `make seed`.

---

## 13) Seed data

**Prompt SEED1 — Demo content**
> Add a dev‑only seeder that creates: one daily note, three tasks (todo/doing/done), one calendar event, and one journal entry. For E2EE, create payloads using a generated temp key. Ensure seeds are gated by `NODE_ENV !== 'production'`.

---

## 14) Assistant polish

**Prompt CHAT1 — System prompt & policies**
> Create a system prompt file that instructs the assistant to (a) respect E2EE and never request keys, (b) propose tasks/events/notes via tool calls only, (c) use short, actionable responses. Load it for `/chat` endpoint.

**Prompt CHAT2 — Tool stubs**
> Add tool handlers for `createTask`, `createEvent`, `createNote`, each calling existing API routes. Ensure all tool calls are logged with only ids and timestamps.

---

## 15) Docs & runbooks

**Prompt DOC1 — Architecture doc**
> Expand `docs/ARCHITECTURE.md` with module diagrams (PlantUML), DB schema excerpts, and component interactions.

**Prompt DOC2 — Runbook**
> Update `docs/RUNBOOK.md` with start/stop, logs, backups, restore, and common issues. Include a section on key backup & restore.

---

## 16) Acceptance & release

**Prompt REL1 — Acceptance script**
> Create `docs/ACCEPTANCE.md` that scripts the demo: daily note → backlink to task → schedule event → journal entry → assistant suggests two tasks. Include expected outputs/screens.

**Prompt REL2 — Release draft**
> Generate `CHANGELOG.md` for v0.1.0 using Conventional Commits, and a GitHub Release draft with highlights, install steps, and known limitations.

---

## 17) Optional integrations (toggle later)

**Prompt INT1 — WebDAV (read/write)**
> Add a WebDAV endpoint for `/files` using a library suitable for Node 22. Gate behind env `WEBDAV_ENABLED=true`.

**Prompt INT2 — CalDAV (read‑only)**
> Expose calendar read‑only over CalDAV. Gate behind `CALDAV_RO_ENABLED=true`.

---

## 18) Guardrails (paste into prompt as reminders)
- Do not log plaintext sensitive content.
- Default to client‑side encryption and local search.
- Ask at most two clarifying questions; otherwise proceed with safe defaults and state assumptions.
- Keep diffs small and focused; include tests and docs updates.

---

## One‑shot meta prompt (use sparingly)
> You are assisting on CORTEX. Follow the SPEC and this Prompt Pack. For the next task, propose a minimal plan, then implement, then print: files changed, test plan, and run instructions. Respect E2EE: never log or persist plaintext; sensitive fields are encrypted client‑side. Prefer client compute; only use server LLM when `Consented-Compute: allowed` header is present.
