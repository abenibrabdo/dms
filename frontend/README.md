## Frontend Overview

### Stack
- React 18 + TypeScript
- Vite dev/build toolchain
- React Router for navigation
- TanStack Query for data fetching & caching
- Axios API client with auth-aware interceptors
- Zustand for lightweight global state (session)
- Tailwind-compatible utility classes via handcrafted theme

### Structure
```
src/
  components/      // Reusable UI building blocks
  layouts/         // Shells and layout components
  pages/           // Route-level views
  hooks/           // Custom hooks for data and state
  services/        // API clients and integrations
  store/           // Zustand stores
  theme/           // Styling primitives
  types/           // Shared TypeScript types
```

### Routes
- `/auth` – authentication flow (sign in/register)
- `/` – dashboard overview with KPI widgets
- `/documents` – document management workspace
- `/workflows` – approval automation status
- `/notifications` – alerts and reminders
- `/settings` – administration and preferences

### Next Steps
1. Connect API hooks (`useDocuments`, etc.) to real backend endpoints.
2. Add forms for metadata editing, workflow creation, and approvals.
3. Integrate real-time notifications via Socket.IO.
4. Layer in localization (Amharic/Oromo/English) and accessibility.
5. Implement role-based UI controls and audit visibility.

