# Demo data

This folder contains temporary frontend-only data. It is intentionally separate
from page components so a future backend integration can replace data providers
without rewriting the presentation layer.

- `filterCatalog.ts`: cascading site, department, team and team-member options.
- Future dashboard API clients should live here, for example `dashboardApi.ts`.
