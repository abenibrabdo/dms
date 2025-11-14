## Goal
Use only local server storage with Multer; remove external storage (S3/MinIO) code and endpoints while keeping existing upload/download flows intact.

## Backend Changes
- Storage layer
  - Simplify `src/core/storage.ts` to local-only: remove S3 client/presigner imports, provider switch, `persistUploadedFile`, and `getSignedDownloadUrl`.
  - Keep `initializeStorage`, `getStoragePath`, `getFilePublicUrl`, `getFileStream`, `deleteFile` for disk.
- Uploads & Downloads
  - In `src/middlewares/upload.ts`, keep `multer.diskStorage` with unique filenames and `env.uploadDir`.
  - Update `src/modules/documents/document.controller.ts` to remove `persistUploadedFile` calls and signed URL handlers.
  - Remove signed URL endpoints from `src/modules/documents/document.router.ts`.
- Configuration & Dependencies
  - Remove storage provider config block from `src/config/env.ts` (or hardcode to local-only and ignore S3 values).
  - Remove `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` from `backend/package.json`.
  - Ensure `app.ts` continues to serve static `/uploads` from `env.uploadDir`.

## Optional Enhancements (Local Only)
- Chunked/resumable uploads
  - Implement local resumable uploads: init → chunk PUT → finalize; write chunks under `storage/uploads/tmp/<sessionId>` and compose file locally.
  - Add integrity checks via per-chunk hash and final hash; optional antivirus hook (local CLI, disabled by default).
- Range downloads
  - Add HTTP Range support for large file downloads; stream partial content from disk.

## Frontend Compatibility
- Keep using server endpoints for upload and download; avoid direct file URLs unless served from `/uploads`.
- No changes needed for Axios client; optionally add a “download” button that hits the streaming endpoints.

## Clean-Up & Verification
- Build and run backend; verify document upload and download flows store/read from `storage/uploads` only.
- Remove now-unused code paths and endpoints; confirm routes in `document.router.ts` match local-only behavior.
- Add basic tests for storage functions and upload/download handlers.

## Rollout
- Perform change as a small refactor, then move on to resumable uploads under local-only storage.

## Next Step
- I will remove the S3-related code/dependencies and signed URL endpoints, confirm local-only uploads/downloads with Multer, and then proceed to implement resumable uploads on local storage.