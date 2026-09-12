# Project Management Frontend

React SPA for the project-management backend. Admins manage workspaces, projects,
tickets, sprints, and referential data. Developers work from a smaller set of
pages (my projects, tasks, board, daily scrum, timesheet).

## Stack

- React 19 + Vite 7
- React Router 7
- MUI 7
- Axios (`src/api/axios.js`)

## Requirements

- Node.js 20+
- Backend running (default `http://localhost:8080`)

## Setup

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173`. Other scripts:

```bash
npm run build
npm run preview
```

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Backend API prefix used by Axios |

Create `frontend/.env` if the API is not on localhost:8080:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Restart `npm run dev` after changing Vite env vars.

The backend CORS allow-list (`app.cors.allowed-origins`) already includes
`http://localhost:5173` and `http://localhost:3000`.

## Authentication

`src/api/axios.js` attaches `Authorization: Bearer <accessToken>` on every
request. Tokens are stored in `localStorage`:

| Key | Value |
| --- | --- |
| `accessToken` | JWT from login/refresh |
| `refreshToken` | Used on `POST /auth/refresh` after a 401 |
| `currentUser` | Cached `/auth/me` (or login payload until `/me` succeeds) |

Public pages: `/login`, `/signup`.

Protected roles (from `user.role`):

- `ADMIN` → `/admin/*`
- `DEVELOPER` → `/developer/*`

SSE helpers in `src/api/realtimeApi.js` open EventSource with
`?access_token=<jwt>` because browsers cannot set Authorization on EventSource.
The backend JWT filter accepts that query parameter.

## Routes

| Path | Role | Screen |
| --- | --- | --- |
| `/login`, `/signup` | public | Auth |
| `/admin` | ADMIN | Dashboard |
| `/admin/projects` | ADMIN | Projects |
| `/admin/epics` | ADMIN | Epics |
| `/admin/tickets` | ADMIN | Tickets |
| `/admin/tickets/:id` | ADMIN | Ticket details |
| `/admin/board` | ADMIN | Board |
| `/admin/roadmap` | ADMIN | Roadmap |
| `/admin/daily-scrum` | ADMIN | Daily scrum |
| `/admin/activities` | ADMIN | Time activities |
| `/admin/project-status` | ADMIN | Project statuses |
| `/admin/ticket-status` | ADMIN | Ticket statuses |
| `/admin/ticket-types` | ADMIN | Ticket types |
| `/admin/ticket-priorities` | ADMIN | Ticket priorities |
| `/admin/users` | ADMIN | Users |
| `/admin/permissions` | ADMIN | Permissions |
| `/admin/roles` | ADMIN | Roles |
| `/admin/timesheet` | ADMIN | Timesheets |
| `/admin/timesheet-dashboard` | ADMIN | Timesheet totals |
| `/admin/timesheet-export` | ADMIN | CSV export |
| `/admin/notifications` | ADMIN | Notifications |
| `/developer` | DEVELOPER | Dashboard |
| `/developer/projects` | DEVELOPER | My projects |
| `/developer/tasks` | DEVELOPER | My tasks |
| `/developer/tickets/:id` | DEVELOPER | Ticket details |
| `/developer/board` | DEVELOPER | Board |
| `/developer/daily-scrum` | DEVELOPER | Daily scrum |
| `/developer/timesheet` | DEVELOPER | Timesheet |
| `/developer/profile` | DEVELOPER | Profile |
| `/developer/notifications` | DEVELOPER | Notifications |

Unknown paths redirect to `/login`.

## API client

All HTTP wrappers live in `src/api/` and call the Spring controllers under
`/api`. Use those modules instead of raw Axios except for one-off cases.

| Module | Backend |
| --- | --- |
| `authApi.js` | `/auth` |
| `workspaceApi.js` | `/workspaces` |
| `projectApi.js` | `/projects` |
| `projectUserApi.js` | `/project-users` |
| `projectStatusApi.js` | `/project-statuses` |
| `projectFavoriteApi.js` | `/project-favorites` |
| `ticketApi.js` | `/tickets` plus compatibility helpers for comments, hours, attachments |
| `ticketCommentApi.js` | `/ticket-comments` |
| `ticketHourApi.js` | `/ticket-hours` |
| `ticketAttachmentApi.js` | `/ticket-attachments` |
| `ticketStatusApi.js` | `/ticket-statuses` |
| `ticketTypeApi.js` | `/ticket-types` |
| `ticketPriorityApi.js` | `/ticket-priorities` |
| `ticketActivityApi.js` | `/ticket-activities` |
| `ticketRelationApi.js` | `/ticket-relations` |
| `ticketSubscriberApi.js` | `/ticket-subscribers` |
| `ticketSavedViewApi.js` | `/projects/{id}/ticket-views` |
| `sprintApi.js` | `/sprints` |
| `epicApi.js` | `/epics` |
| `labelApi.js` | `/projects/{id}/labels` |
| `milestoneApi.js` | `/projects/{id}/milestones` |
| `dailyScrumApi.js` | `/daily-scrums` |
| `timeSheetApi.js` | `/time-sheets` |
| `timeSheetCellApi.js` | `/time-sheet-cells` |
| `userApi.js` | `/users` |
| `roleApi.js` | `/roles` |
| `permissionApi.js` | `/permissions` |
| `rolePermissionApi.js` | `/role-permissions` |
| `userRoleApi.js` | `/user-roles` |
| `activityApi.js` | `/activities` |
| `documentApi.js` | `/documents` |
| `notificationApi.js` | `/notifications` |
| `dashboardApi.js` | `/dashboard/developer` |
| `analyticsApi.js` | `/projects/{id}/analytics` |
| `auditApi.js` | audit-events |
| `settingApi.js` | `/settings` |
| `applicationMetadataApi.js` | `/application-metadata` |
| `webPushApi.js` | `/web-push`, `/web-push-subscriptions` |
| `realtimeApi.js` | `/realtime` SSE |

Notifications UI also uses `src/services/notificationService.js`, which talks to
the same `/notifications` endpoints through the shared Axios instance.

## Backend pairing

See `../backend/README.md` and `../backend/API.md` for auth, env, and the
full endpoint list. Typical local pair:

1. PostgreSQL database `pmt` on `localhost:5432`
2. `mvn spring-boot:run` in `backend`
3. `npm run dev` in `frontend`

## LAN / SAME-NETWORK ACCESS

The frontend is configured for access from another PC on the same network.

Set `VITE_API_BASE_URL=http://<LAN_IP>:8080/api` in `.env`, where `<LAN_IP>` is the IPv4 address of the PC running Spring Boot and Vite. Vite uses `VITE_DEV_HOST=0.0.0.0` and `VITE_DEV_PORT=5173`.

Start with:

```bash
npm run dev
```

Then open `http://<LAN_IP>:5173` from another PC on the same LAN. The backend must allow that frontend origin through `APP_CORS_ALLOWED_ORIGINS`.

