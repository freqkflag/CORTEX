# Contributing to CORTEX

Thanks for helping improve CORTEX! This guide highlights the essentials so you can get productive quickly while keeping the platform safe and privacy-first.

## Development Workflow

1. Create a feature branch using the format `dev-unit-{feature}-{date}-{time}` (for example, `dev-unit-e2ee-index-2025-10-05-08-16-02`).
2. Install project dependencies and verify the toolchain:
   - Node.js 22 or newer
   - Docker Engine and Docker Compose (for running the local stack)
3. Run the standard checks before you push:
   - `npm ci`
   - `npm run lint`
   - `npm run build`
   - `npm test`
   - `npm run db:migrate` (after generating migrations) when your change modifies database schema
4. Keep sensitive data encrypted end-to-end. Never log plaintext secrets or decrypted payloads on the server.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org) specification. CI emits a warning when commits do not follow this format, so please keep your history compliant.

A Conventional Commit message uses the structure:

```
<type>(<optional scope>): <summary>
```

- **type** is required and must be one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, or `test`.
- **scope** is optional but recommended for clarity (for example, `api`, `web`, or `infra`).
- **summary** should be concise, written in the imperative mood, and lowercase except for proper nouns.

### Examples

- `feat(api): add blind index tokens`
- `fix(web): preserve offline queue on tab close`
- `ci: warn on non-conventional commit messages`

Following this convention keeps the history searchable and enables automated tooling (release notes, changelog generation, etc.).

## Pull Requests

- Keep PRs focused and include a summary of the changes, risks, and test coverage.
- Highlight any security, privacy, or migration considerations.
- If your change affects the UI, capture a screenshot of the relevant update.

We appreciate your contributions and the care you take to keep user data private by default.
