## Backend Overview

### Goals
- Deliver a monolithic Express + TypeScript API that addresses the DMS requirements in `readme-me.md`.
- Modularize by domain (auth, documents, workflows, notifications, search, analytics) while sharing common infrastructure.
- Provide extensibility for future services (OCR, AI classification, reporting) without microservice overhead.

### Layered Architecture
- **Entry points**: `server.ts` boots the HTTP and WebSocket servers, `app.ts` wires middleware and routes.
- **Presentation**: Route handlers in `src/routes` map HTTP requests to controller methods and enforce validation.
- **Application**: Controllers coordinate domain services, orchestrating workflows, security checks, and messaging.
- **Domain**: Services in `src/modules/**/services` encapsulate core business logic, working with repositories and external providers.
- **Infrastructure**: Shared modules under `src/core` supply database access, configuration, logging, event bus (Socket.IO + RabbitMQ placeholder), and utility helpers.

### Key Modules
- `auth`: user registration, login, MFA, session tokens, RBAC.
- `documents`: document CRUD, versioning, metadata, storage orchestration, uploads/downloads, OCR hooks.
- `workflows`: approval pipelines, tasks, notifications, audit logs.
- `collaboration`: comments feed, document locking controls, realtime hooks foundation.
- `search`: SQL-backed metadata search with multi-filter support and future space for external engines.
- `analytics`: metrics aggregation, dashboard summaries, export-friendly insights.
- `audit`: tamper-evident action logging for compliance and forensic analysis.
- `localization`: translation resources for Amharic/Oromo/English with admin-managed bundles.
- `sync`: offline/mobile snapshot API for incremental document/workflow/comment retrieval.

### Cross-Cutting Concerns
- **Security**: Helmet, dynamic CORS allow-list, global rate limiting, request correlation IDs, JWT/refresh + optional 2FA roadmap, AES encryption helper placeholders.
- **Database**: MySQL via Sequelize ORM with declarative domain models, migrations roadmap, and transaction support.
- **Storage**: Local disk storage (configurable) with an abstraction layer ready for S3/MinIO integration.
- **Messaging**: In-process event emitter initially; easy migration path to RabbitMQ; Socket.IO for real-time updates.
- **Realtime**: Socket.IO gateway broadcasting document/workflow/notification events, with RabbitMQ placeholders for downstream consumers.
- **Validation**: Centralized schemas via Joi; custom middleware for request validation.
- **Observability**: Pino logger, request tracing IDs, centralized error handling with structured responses.
- **Audit Trail**: Every document/workflow/notification mutation is persisted to `AuditLog` with `/api/audit` access.

- **File Handling**: Multer-powered streaming uploads to disk (pluggable storage), resumable/chunked upload roadmap, secure download streaming.
- **Localization**: Locale negotiation middleware resolves `req.locale`; `/api/localization` serves and manages translation resources.
- **Offline Sync**: `/api/sync` endpoint delivers incremental updates for mobile and offline clients.

### Security Hardening
- `CORS_ORIGINS` environment variable controls allowed origins (comma-separated, `*` permitted for dev).
- Global rate limiting defaults to 500 requests / 15 minutes (override via `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX`).
- `requestContext` middleware issues/propagates `x-request-id` headers and logs lifecycle events.
- Helmet hardened with cross-origin resource policy disabled to support file downloads; additional headers can be layered in production.
- Further protections (MFA enforcement, device/IP allow lists, WAF) remain on the roadmap.

### File Upload & Download
- Upload new documents via `POST /api/documents/upload` (multipart form with `file` + metadata fields).
- Realtime events:
  - `documents.updated` – emitted on creation, metadata changes, lock/unlock.
  - `documents.version.added` – emitted when new revisions arrive.
  - `documents.comment.added` – emitted when collaboration comments are posted.
  - `documents.presence.updated` – emitted as collaborators join, leave, or heartbeat presence.
  - `workflows.updated` – emitted on creation/approval/rejection/reassign.
  - `notifications.created` / `notifications.read` – emitted for alert lifecycle.
- Queue placeholders publish matching routing keys for future RabbitMQ consumption.
- Append new versions with `POST /api/documents/:id/versions/upload`.
- Download latest versions through `GET /api/documents/:id/download`, or specific revisions via `GET /api/documents/:id/versions/:version/download`.
- Storage abstraction (`core/storage.ts`) prepares for S3/MinIO integration; current default stores files under `storage/uploads`.
- Uploaded files are served from `/uploads/<filename>` and each document version stores the public URL alongside its storage key.
- Enforce `editor`/`admin` roles for upload endpoints; downloads require authenticated access.

### Admin Seeding
- Configure seed credentials via environment:
  - `ADMIN_SEED_EMAIL`
  - `ADMIN_SEED_PASSWORD`
  - `ADMIN_SEED_FIRST_NAME` / `ADMIN_SEED_LAST_NAME` / `ADMIN_SEED_DEPARTMENT`
- Run `npm run seed:admin` to create the initial administrator (idempotent; skips if user exists).
- Seed flow uses the same hashing pipeline as runtime auth, ensuring consistency.

### Database Configuration
- Set the MySQL connection details via the following environment variables:
  - `DB_HOST` / `DB_PORT`
  - `DB_USER` / `DB_PASSWORD`
  - `DB_NAME`
  - Optional toggles: `DB_LOGGING` (`true` to enable SQL logging) and `DB_SYNC` (`false` to skip auto-sync; use migrations instead).
- Sequelize models auto-sync on startup by default; switch off in production once migrations are in place.

### Audit Trail Usage
- `POST` handlers internally call `recordAuditLog` to persist who did what, when, and optional metadata.
- Retrieve audit history via `GET /api/audit?entityType=document&entityId=<id>` (RBAC protected: `admin`/`auditor`).
- Extend audits by enriching `metadata` objects (diffs, IP, device) or plugging external log pipelines.

### Next Steps
1. Scaffold application skeleton (`src` directories, configuration, core utilities).
2. Implement authentication and user management flows (admin seed, MFA, password policies).
3. Extend document lifecycle endpoints with file uploads, storage, and OCR integration.
4. Expand workflow automation, task assignments, and collaboration realtime events.
5. Extend audit insights to include diff snapshots, export, and retention policies.
6. Harden search relevance, analytics insights, reporting pipelines, and security/observability toolchain.

