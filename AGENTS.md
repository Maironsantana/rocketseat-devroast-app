# Project Notes

- DevRoast is a web app for pasting code, receiving roast-style feedback, and browsing a shame leaderboard.
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS v4, Base UI, Shiki.
- Keep the visual language dark, terminal-inspired, compact, and code-first.
- Prefer semantic Tailwind theme tokens from `@theme` over raw color values.
- Shared UI lives in `src/components/ui`; prefer composition-first APIs with named exports for reusable internal regions.
- Use Base UI for interactive primitives and keep syntax-highlighted code rendering server-side when showing formatted code.
- App pages should reuse existing UI primitives before introducing feature-specific components.
- Create a spec in `specs/` before implementing new features, integrations, or larger refactors.
- Treat `tRPC` as the main typed API layer for frontend-backend communication in the App Router.
- Prefer server components for data loading; only use client components when interaction, browser APIs, or animation require them.
- When data loads asynchronously in the UI, prefer `Suspense` plus explicit skeleton states instead of ad-hoc loading text.
- For animated numeric reveals after hydration, prefer `@number-flow/react` in a small client component instead of turning larger sections client-side.
