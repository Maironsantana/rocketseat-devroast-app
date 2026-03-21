# Project Notes

- DevRoast is a web app for pasting code, receiving roast-style feedback, and browsing a shame leaderboard.
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS v4, Base UI, Shiki.
- Keep the visual language dark, terminal-inspired, compact, and code-first.
- Prefer semantic Tailwind theme tokens from `@theme` over raw color values.
- Shared UI lives in `src/components/ui`; prefer composition-first APIs with named exports for reusable internal regions.
- Use Base UI for interactive primitives and keep syntax-highlighted code rendering server-side when showing formatted code.
- App pages should reuse existing UI primitives before introducing feature-specific components.
