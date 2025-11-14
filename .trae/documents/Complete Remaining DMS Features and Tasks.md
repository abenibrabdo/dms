## Scope Overview
- Implement remaining features across security, storage/uploads, messaging/realtime, workflow UI, search/OCR, analytics, localization/accessibility, offline/sync, and testing/operations.
- Keep existing stack and patterns: Express + TypeScript + Sequelize (MySQL) backend; React + Vite + TS frontend; Axios + TanStack Query + Zustand; Socket.IO for realtime.
- Follow module conventions (router/controller/service/model/schema) and reuse middleware (auth, validation, rate-limit, upload).

## Backend Enhancements
- Storage abstraction
  - Extend `backend/src/core/storage.ts` to support S3/MinIO alongside local disk; add signed URL helpers.
  - Update upload middleware in `backend/src/middlewares/upload.ts` to allow storage target selection and virus scan hook.
- Resumable/chunked uploads
  - Add endpoints under `/api/documents/uploads/*` for init, chunk PUT, finalize, and abort.
  - Add Sequelize models to track upload sessions and chunk state; enforce integrity via checksum.
- OCR/Text extraction & indexing
  - Add background job to extract text from PDFs/images (Tesseract or service) and store `content_text` on versions.
  - Extend search module to query metadata + full-text over `content_text` (consider MySQL FULLTEXT or Meilisearch if needed).
- Messaging queue (RabbitMQ)
  - Implement `backend/src/core/queue.ts` publisher/consumer; configure connection via env.
  - Create consumers in `backend/src/consumers/*` for notifications, workflow events, OCR tasks, analytics aggregations.
- Workflow services
  - Finalize `workflow.service.ts` advancing logic (approve/reject/reassign) with audit logging and notifications.
  - Add SLA/escalation timers via queue-delayed messages; expose status history.
- Audit & analytics
  - Ensure audit logging for document/version changes, auth events, workflow actions.
  - Add analytics aggregation endpoints for export (CSV/PDF) and filters.
- Localization resources
  - Ensure CRUD endpoints are complete; include namespace/language validations and caching.
- Sync API
  - Finalize incremental sync response format with cursors and conflict markers.

## Security & Auth
- MFA (TOTP)
  - Add endpoints `/api/auth/mfa/setup`, `/api/auth/mfa/verify`, `/api/auth/mfa/disable`; store per-user secrets and recovery codes.
- Password policy
  - Enforce complexity on register/reset; add configurable policies via env.
- Device/IP controls
  - Add allow/deny lists on login with admin-managed lists; audit all denials.
- Token hardening
  - Refresh token rotation, reuse detection; short-lived access tokens; secure cookie option.

## Frontend Enhancements
- Auth UI
  - Add MFA setup/verify flows in `frontend/src/pages/AuthPage.tsx` and components; align with backend endpoints.
- Documents UI
  - Implement resumable upload UI (init → chunk upload → finalize) with progress, retries.
  - Show versions with full-text search highlights; add download via signed URLs.
- Workflow UI
  - Create pages for workflow creation, task inbox, approvals, reassignments; show SLA timers and history.
- Collaboration UI
  - Comments with mentions/file attachments; presence indicators; basic lock status; realtime updates via Socket.IO.
- Notifications UI
  - Toasts and inbox; mark-as-read; realtime subscription wiring.
- Search & Analytics UI
  - Advanced filters, relevance indicators; analytics dashboards with charts and exports.
- Localization & Accessibility
  - Integrate i18n (consuming backend resources); language switcher; improve ARIA/keyboard navigation.
- Offline & Sync
  - Add PWA support and offline caching for documents metadata; integrate sync cursors with conflict banners.

## Data & Migrations
- Replace auto `sync` with Sequelize migrations for new models/columns (uploads sessions, full-text fields, MFA).
- Seed scripts: extend `seed-admin.ts` for policy defaults and test data.

## Configuration & Observability
- Add env keys for S3/MinIO, RabbitMQ, password policy, MFA, IP lists.
- Add centralized logger fields (request id, user id) and metrics (Prometheus-compatible) for key actions.
- Harden security headers and CORS based on `env.ts`.

## Testing Strategy
- Backend unit/integration tests (Vitest + Supertest): auth, documents (uploads/versions), workflows, search, notifications.
- Frontend unit/integration tests (Vitest + Testing Library): auth flows incl. MFA, upload UI, workflow actions, realtime updates.
- E2E smoke (optional): minimal flows for login → upload → approve workflow → search.

## Verification & Rollout
- Dev: run backend and frontend dev servers; verify endpoints with Postman.
- Realtime: simulate events; ensure client UI updates without refresh.
- Uploads: large-file tests; network throttling to validate resume/retry.
- Search: sanity checks for metadata and content-text indexing.
- Migrations: run against clean and existing DBs; rollback tests.

## Phased Milestones
- Phase 1 (Security & Storage): MFA, password policy, IP/device controls; S3/MinIO integration; signed URLs.
- Phase 2 (Uploads & Messaging): Resumable uploads; RabbitMQ setup; consumers for notifications/workflows/OCR.
- Phase 3 (Workflow & Collaboration): Workflow UI, escalation logic; comments/mentions/presence; Socket.IO wiring.
- Phase 4 (Search & Analytics): OCR/text extraction; full-text search; analytics dashboards and exports.
- Phase 5 (Localization, Accessibility, Offline/Sync): i18n in frontend; accessibility improvements; PWA + sync.
- Phase 6 (Testing & Ops): Comprehensive tests; migrations; observability; hardening.

## Deliverables
- Updated backend modules with queue, storage, OCR, search, auth hardening, migrations.
- Frontend pages/components for MFA, uploads, workflows, collaboration, analytics, localization, offline.
- Test suites and seed data; environment configuration updates.

## Next Steps
- Confirm this plan; then I will implement Phase 1 immediately, following repository conventions and verifying with tests.