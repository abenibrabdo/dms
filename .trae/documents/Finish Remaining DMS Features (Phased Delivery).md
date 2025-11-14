# Finish Remaining DMS Features

## Current State Snapshot
- Backend: Express + TS, Sequelize (MySQL), modules for auth/documents/workflows/notifications/search/analytics/audit/localization/sync; uploads via Multer; realtime via Socket.IO; storage abstraction (local + S3 already scaffolded).
- Frontend: React + Vite + TS; routes for dashboard/documents/workflows/notifications/settings; Axios + Query + Zustand.
- Implemented: document CRUD + versioning, uploads/downloads, audit logs, analytics basics, search (metadata), localization resources, sync snapshot, RBAC middleware.
- Pending: MFA setup/disable flows; resumable uploads; external storage UX; RabbitMQ queue; workflow UI; collaboration UX; frontend realtime; OCR + full‑text search; advanced analytics; i18n in FE; accessibility; offline sync; test coverage; migrations.

## Phase 1 — Security & Auth
1. MFA (TOTP) Endpoints
- Add `/api/auth/mfa/setup` (issue secret + QR), `/api/auth/mfa/verify`, `/api/auth/mfa/disable`.
- Persist encrypted secret and recovery codes; update `UserModel` and migrations.
- Acceptance: login requires `mfaCode` when enabled; recovery codes rotate; audit entries.
2. Password Policy & Reset
- Enforce policy in register/reset; add `/api/auth/reset/request` and `/api/auth/reset/confirm`.
- Email-less flow stub with token issuance; add audits.
3. Device/IP Controls
- Admin endpoints to manage allow/block lists; persist configuration; expose listing.

## Phase 2 — Storage & Uploads
1. Resumable/Chunked Uploads
- Endpoints: `POST /api/documents/uploads/init`, `PUT /api/documents/uploads/:id/chunks/:n`, `POST /api/documents/uploads/:id/finalize`, `DELETE /api/documents/uploads/:id`.
- Model: `UploadSession` (documentId, totalSize, chunkSize, receivedChunks, checksum).
- Integrity: per-chunk checksum + final hash; antivirus scan hook.
- Acceptance: resume after network loss; large files succeed; audit events recorded.
2. Signed URLs (S3)
- Generate short‑lived signed URLs for FE direct download; fallback to streaming endpoint.
- Enforce auth/RBAC on signature issuance.

## Phase 3 — Messaging & Realtime
1. RabbitMQ Integration
- Implement queue connection, publisher, consumers: notifications, workflow events, OCR tasks.
- Dead‑letter and retry policies; env config.
- Acceptance: events persist off process; consumer idempotency.
2. Frontend Realtime Wiring
- Socket.IO client subscriptions in Documents/Workflows/Notifications pages; live updates.

## Phase 4 — Workflow & Collaboration
1. Workflow UI & Services
- Pages: builder (steps/assignees), task inbox, approval/reject/reassign.
- SLA/escalation timers (delayed messages via queue); status history API.
- Acceptance: workflow transitions create audits/notifications; UI reflects state.
2. Collaboration
- Comments with mentions/attachments; presence indicators; lock status; conflict resolution.
- Realtime updates on new comments/presence.

## Phase 5 — Search & OCR
1. OCR/Text Extraction
- Background job for PDFs/images (Tesseract or external service); persist `content_text` on versions.
- Queue OCR tasks on upload; retry strategy.
2. Full‑Text Search
- Extend search to include `content_text` and tags; implement MySQL FULLTEXT or external engine (Meilisearch/Elastic).
- Acceptance: keyword search returns relevant snippets; filters combine with text search.

## Phase 6 — Analytics & Reporting
- Dashboards: storage, activity trends, workflow efficiency; CSV/PDF export endpoints.
- Scheduled reports via queue; role‑based access.

## Phase 7 — Localization, Accessibility, Offline/Sync
- FE i18n integration (consume `/api/localization`); language switcher; resource caching.
- Accessibility: semantic markup, keyboard navigation, ARIA roles.
- Offline: PWA manifest; cache documents metadata; incremental sync cursors and conflict banners.

## Phase 8 — Testing, Migrations, Ops
- Backend tests (Vitest + Supertest): auth (MFA/reset), documents (uploads/versions), workflows, search, notifications.
- Frontend tests (Vitest + Testing Library): login/MFA, upload UI, workflow actions, realtime.
- Replace auto sync with migrations for new tables/columns (uploads, MFA fields).
- Observability: request/user ids in logs; Prometheus metrics; hardened CORS/headers.

## Key Implementation Files (Back)
- Auth: `src/modules/auth/*` (router/controller/service/model/schema/types).
- Documents: `src/modules/documents/*` (controller for uploads, service for versions).
- Storage: `src/core/storage.ts` (provider switch, signed URLs helper).
- Queue: `src/core/queue.ts`, `src/consumers/*` (new).
- Search/OCR: `src/modules/search/*`, `src/modules/documents/*` (OCR hooks), `src/core/queue.ts`.
- Analytics: `src/modules/analytics/*`.

## Key Implementation Files (Front)
- API client: `src/services/apiClient.ts` (auth headers, error handling).
- Pages: `src/pages/*` — Auth, Documents (upload list/progress), Workflows, Notifications, Dashboard.
- Components: `src/components/documents/*`, `src/components/workflows/*`.
- Realtime: Socket.IO wiring in app bootstrap and per‑page hooks.
- i18n: `src/theme`/`src/services` with resource loader and provider.

## Acceptance Criteria & Verification
- Security: MFA setup/verify/disable flows; blocked IP/device rejected; audit trails recorded.
- Uploads: large files upload/chunk/Resume verified; integrity satisfied; S3 signed URLs work.
- Realtime: comments/presence/workflow updates visible without refresh.
- Search: OCR text indexed; combined metadata + content queries return expected results.
- Analytics: dashboards show correct metrics; CSV/PDF generated.
- Localization/Accessibility: switch languages; basic WCAG checks pass.
- Tests: green CI for BE/FE suites; migrations run cleanly.

## Config Additions
- Messaging: `RABBITMQ_URL`, queue names, retry/dlq settings.
- Storage: S3/MinIO keys (already structured); antivirus toggle.
- Security: IP/device allowlists; password policy toggles; MFA enforcement flag.
- Reporting: export limits; schedule cadence.

## Rollout Plan
- Implement by phases; ship behind flags where needed.
- Provide migration scripts per phase; include seed data for demo flows.
- Add smoke E2E (login → upload → approve workflow → search → download).

## Next Step
- Confirm this plan; I will begin Phase 1 immediately and deliver in verified increments with tests and clear progress updates.