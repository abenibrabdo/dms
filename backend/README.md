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
- `search`: MongoDB text search façade with multi-filter support and future space for external engines.
- `analytics`: metrics aggregation, dashboard summaries, future audit/reporting feeds.
- `audit`: tamper-evident action logging for compliance and forensic analysis.

### Cross-Cutting Concerns
- **Security**: Helmet, dynamic CORS allow-list, global rate limiting, request correlation IDs, JWT/refresh + optional 2FA roadmap, AES encryption helper placeholders.
- **Storage**: GridFS/MongoDB for binary files; abstracted repository interface for future S3/MinIO integration.
- **Messaging**: In-process event emitter initially; easy migration path to RabbitMQ; Socket.IO for real-time updates.
- **Realtime**: Socket.IO gateway broadcasting document/workflow/notification events, with RabbitMQ placeholders for downstream consumers.
- **Validation**: Centralized schemas via Joi; custom middleware for request validation.
- **Observability**: Pino logger, request tracing IDs, centralized error handling with structured responses.
- **Audit Trail**: Every document/workflow/notification mutation is persisted to `AuditLog` with `/api/audit` access.

- **File Handling**: Multer-powered streaming uploads to disk (pluggable storage), resumable/chunked upload roadmap, secure download streaming.

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
  - `workflows.updated` – emitted on creation/approval/rejection/reassign.
  - `notifications.created` / `notifications.read` – emitted for alert lifecycle.
- Queue placeholders publish matching routing keys for future RabbitMQ consumption.
- Append new versions with `POST /api/documents/:id/versions/upload`.
- Download latest versions through `GET /api/documents/:id/download`, or specific revisions via `GET /api/documents/:id/versions/:version/download`.
- Storage abstraction (`core/storage.ts`) prepares for S3/GridFS integration; current default stores files under `storage/uploads`.
- Enforce `editor`/`admin` roles for upload endpoints; downloads require authenticated access.

### Admin Seeding
- Configure seed credentials via environment:
  - `ADMIN_SEED_EMAIL`
  - `ADMIN_SEED_PASSWORD`
  - `ADMIN_SEED_FIRST_NAME` / `ADMIN_SEED_LAST_NAME` / `ADMIN_SEED_DEPARTMENT`
- Run `npm run seed:admin` to create the initial administrator (idempotent; skips if user exists).
- Seed flow uses the same hashing pipeline as runtime auth, ensuring consistency.

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

