# tRPC Integration Notes

- Follow the App Router setup with `@trpc/tanstack-react-query`.
- Keep the React provider in `src/trpc/client.tsx`, the query client factory in `src/trpc/query-client.ts`, and the server proxy in `src/trpc/server.ts`.
- Server components should prefer `trpc.<route>.queryOptions()` with `prefetchQuery(...)`, `dehydrate(...)`, and `HydrationBoundary`.
- Client components should read prefetched data with TanStack Query suspense APIs when possible.
- Avoid legacy `pages` router patterns or `@trpc/next` setup in this project.
