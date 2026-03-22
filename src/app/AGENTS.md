# App Router Notes

- Default to server components for route files in `src/app`.
- If a page needs client-only UI, keep the route as a server wrapper and move interactivity into a dedicated client component.
- For fetched data, prefer server-side prefetch with `HydrationBoundary` and client consumption through suspense-aware queries.
- Use `Suspense` boundaries close to the async UI and render skeleton components that preserve layout.
- Keep client components focused on editor behavior, browser APIs, and animations; do not move data access there unless necessary.
- Reuse `src/components/ui` primitives before creating route-specific markup.
