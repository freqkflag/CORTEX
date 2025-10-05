# WholeLife (Self‑Hosted)

Privacy‑first, local‑first personal platform to manage your whole life: Tasks, Calendar, Notes (with backlinks), Journal, and modular domains (Health, Finances, Family, Pets, Auto, Career, Projects, Hobbies, Trips, Memories, Photo Galleries, Sexual Health, Document Storage, Small Business, Personal Branding, Personal Website, Social Media). End‑to‑end encryption (E2EE) is **on by default**. A local LLM (via Ollama) powers an on‑device/own‑server assistant with private retrieval (LlamaIndex + pgvector).

> **Status:** MVP scaffold. See [`/docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and SPEC for design details.

---

## Features (MVP)
- **E2EE everywhere**: client‑side encryption for sensitive fields; server stores ciphertext.
- **Core spine**: Notes (Markdown + backlinks), Tasks (RRULE), Calendar (ICS‑compatible), Journal.
- **Thin modules**: Health, Finances, Family, Pets, Auto, Career, Projects, Hobbies, Trips, Memories, Photos, Sexual Health, Documents, Small Business, Personal Branding, Website, Social.
- **Local assistant**: runs small local models (CPU‑friendly) with private context; per‑action opt‑in to use server compute.
- **Dual storage**: local filesystem and/or S3‑compatible (MinIO) object storage.
- **PWA**: offline capture with background sync; responsive UI.
- **Import/Export**: Markdown/CSV/ICS; full backups & restore scripts.

---

## Architecture (at a glance)
- **API**: Node 22 LTS, NestJS (Fastify). Modular monolith + plugin loader.
- **DB**: PostgreSQL + `pgvector` for embeddings. Attachments on disk and/or S3/MinIO.
- **Index/LLM**: LlamaIndex sidecar + Ollama for chat/embeddings.
- **TLS/Proxy**: Caddy reverse proxy, HSTS.
- **Containers**: Docker Compose stack (db, minio, ollama, indexer, api, web, caddy).

Diagrams and schemas live in [`/docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and the SPEC.

---

## Getting Started

### Prerequisites
- **Node.js 22+**
- **Docker** with **Compose** plugin
- **Git**

### Clone & Configure
```bash
git clone https://github.com/<you>/wholelife.git
cd wholelife
cp infra/docker/.env.example infra/docker/.env
# Optionally edit infra/docker/.env (domain, storage, models)
```

### Boot the stack (development)
```bash
npm i
npm run dev:compose
```
- API: `https://localhost/api`
- Web: `https://localhost` (Caddy uses an internal certificate in dev)
- Ollama API: `http://localhost:11434`
- MinIO: `http://localhost:9001` (console)

> First run pulls images and builds the app; subsequent runs are faster.

### Stop & clean
```bash
docker compose -f infra/docker/docker-compose.yml down
```

---

## Configuration
Environment lives in `infra/docker/.env`. Common settings:

| Var | Description |
|-----|-------------|
| `APP_DOMAIN` | Hostname (e.g., `localhost` for dev). |
| `APP_URL` | Public URL (used by web client). |
| `JWT_SECRET` | Long random string for API tokens. |
| `STORAGE_DRIVER` | `local` or `s3`. |
| `FILES_DIR` | Local files root when using `local`. |
| `S3_ENDPOINT`/`S3_BUCKET`/`S3_ACCESS_KEY`/`S3_SECRET_KEY` | S3/MinIO settings. |
| `CHAT_MODEL` | Default Ollama chat model (e.g., `llama3.1:8b-instruct-q4_0`). |
| `EMBED_MODEL` | Default embedding model (e.g., `bge-m3`). |

Postgres credentials are defined in `docker-compose.yml` for the `db` service.

---

## Repository Layout
```
apps/      # api (NestJS), web (React/Vite), indexer (LlamaIndex stub)
packages/  # shared SDKs
modules/   # core modules (tasks, calendar, notes, journal)
infra/     # docker compose, caddy, db init, scripts
docs/      # runbook, architecture, E2EE notes, ADR template
```

---

## Security & Privacy
- **E2EE by default**: encryption occurs client‑side; sensitive payloads are never in server plaintext.
- **Consented Compute**: per‑action opt‑in when heavier server compute is desired; actions are audited.
- **Backups**: DB dumps + file/object sync. Keys are **not** backed up server‑side.
See [`/docs/E2EE.md`](docs/E2EE.md) and [`SECURITY.md`](SECURITY.md).

---

## Backup & Restore
Scripts live in `infra/scripts`.
```bash
# Backup (creates backups/YYYY-MM-DD/db.sql)
./infra/scripts/backup.sh

# Restore
./infra/scripts/restore.sh 2025-01-01
```

> Ensure you have exported your client E2EE keys securely; server backups alone cannot decrypt data.

---

## Development
- Monorepo with npm workspaces + Turbo.
- API: NestJS (Fastify). Web: React/Vite.
- Run everything in Docker via `npm run dev:compose`.
- Lint/tests placeholders are present; wire up your preferred toolchain.

---

## Roadmap (excerpt)
- Depth on Health & Finances (charts, med schedules, budgets).
- WebDAV, CalDAV (RO), richer importers.
- Plugin SDK + MCP tool catalog.
- Photo pipelines (EXIF, thumbnails), client‑side search indexes.
- Multi‑user/household sharing (post‑MVP).

Full plan: see the Project Plan document.

---

## Contributing
Guidelines in [`CONTRIBUTING.md`](CONTRIBUTING.md). Issues and PRs welcome. Please follow the Code of Conduct.

---

## License
[MIT](LICENSE)

---

## FAQ
**Where is my data stored?**  
Structured data in Postgres; files on local disk and/or S3/MinIO. Sensitive fields are encrypted client‑side.

**Do I need a GPU?**  
No. Defaults target CPU‑friendly models. You can add a GPU later.

**Can I import existing notes/tasks/calendar?**  
Yes. Markdown/CSV/ICS import is included in the roadmap and partially scaffolded.

**Can I disable modules I don’t use?**  
Yes. Modules are loaded via manifests; the UI only shows enabled modules.

