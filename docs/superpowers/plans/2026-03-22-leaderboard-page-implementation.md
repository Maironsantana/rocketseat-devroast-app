# Leaderboard Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mocked `/leaderboard` page with a cached server-first implementation backed by `tRPC`, real leaderboard data, and the same collapsible syntax-highlighted code experience used on the homepage.

**Architecture:** Keep the data domain in `src/server/api/services/leaderboard-service.ts` with a new `leaderboard.page` procedure, then render the dedicated page as a server-first route that reads cached data through Next.js cache components. Enable `cacheComponents` in `next.config.ts`, use `'use cache'` plus `cacheLife(...)` in cached server functions/components, and keep the interactive client footprint limited to the existing collapsible wrapper so `CodeBlock` stays server-rendered.

**Tech Stack:** Next.js 16 App Router cache components, React 19, tRPC v11, TanStack Query hydration utilities, Drizzle ORM, Shiki, Base UI, TypeScript.

---

## File Structure

- Modify: `next.config.ts` - enable Next.js `cacheComponents` so `'use cache'` can be used in App Router code paths.
- Modify: `src/server/api/services/leaderboard-service.ts` - add the dedicated leaderboard-page query logic, aggregation helpers, and any shared language-normalization helpers needed by homepage and page.
- Modify: `src/server/api/routers/leaderboard.ts` - expose the new `leaderboard.page` procedure.
- Modify: `src/app/leaderboard/page.tsx` - replace mocks with cached server-first data loading and route composition.
- Create: `src/app/leaderboard/_components/leaderboard-page-content.tsx` - server component that renders the page shell, stats, list, and empty state from resolved data.
- Create: `src/app/leaderboard/_components/leaderboard-page-card.tsx` - server component for one leaderboard entry, including `CodeBlock` preview/full render and roast content.
- Create: `src/app/leaderboard/_components/leaderboard-page-skeleton.tsx` - loading fallback that preserves the page structure.
- Create: `src/app/leaderboard/_components/leaderboard-page-code-preview.tsx` only if the homepage wrapper cannot be reused cleanly from the new route; otherwise reuse `src/app/_components/homepage-leaderboard-code-preview.tsx` directly and skip this file.
- Modify: `src/app/_components/homepage-leaderboard.tsx` only if needed to reuse shared language-normalization helpers without duplicating logic.

### Task 1: Enable cache components and define the caching boundary

**Files:**
- Modify: `next.config.ts`
- Modify: `src/app/leaderboard/page.tsx`
- Reference: `docs/superpowers/specs/2026-03-22-leaderboard-page-design.md`

- [ ] **Step 1: Set the caching baseline for the route**

Use Next.js cache components with:

```ts
const nextConfig: NextConfig = {
  cacheComponents: true,
}
```

and apply `'use cache'` plus `cacheLife({ stale: 300 })` only in server-only functions/components for this page flow.

- [ ] **Step 2: Enable cache components in `next.config.ts`**

Set the config to:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

- [ ] **Step 3: Replace the route-level static marker in `src/app/leaderboard/page.tsx`**

Remove `export const dynamic = "force-static"` and prepare the route to consume a cached server function instead of mocked constants.

- [ ] **Step 4: Add a cached server function for leaderboard page data**

In `src/app/leaderboard/page.tsx` or a colocated server-only helper, create a dedicated cached prefetch function such as:

```ts
import { cacheLife } from "next/cache";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

async function getCachedLeaderboardQueryState() {
  "use cache";
  cacheLife({ stale: 300 });

  const queryClient = getQueryClient();
  const queryOptions = trpc.leaderboard.page.queryOptions();
  const data = await queryClient.fetchQuery(queryOptions);

  return {
    data,
    dehydratedState: dehydrate(queryClient),
  };
}
```

This keeps the plan aligned with the approved 5-minute cache boundary without depending on named cache profiles.

- [ ] **Step 5: Verify the config and route compile conceptually**

Run: `npm run lint next.config.ts src/app/leaderboard/page.tsx`

Expected: the command path may need to stay as full-project `npm run lint`; if so, note that Biome has no per-file CLI in this repo and use full lint later instead of forcing a partial command.

### Task 2: Implement the backend contract for `leaderboard.page`

**Files:**
- Modify: `src/server/api/services/leaderboard-service.ts`
- Modify: `src/server/api/routers/leaderboard.ts`
- Reference: `src/db/schema.ts`

- [ ] **Step 1: Add the new response types in `src/server/api/services/leaderboard-service.ts`**

Define explicit types for:

```ts
type LeaderboardPageEntry = {
  rank: number;
  score: number;
  language: string;
  sourceCode: string;
  roast: string;
  lines: number;
};

type LeaderboardPageData = {
  entries: LeaderboardPageEntry[];
  stats: {
    totalEntries: number;
    averageScore: number;
  };
};
```

- [ ] **Step 2: Implement the shared leaderboard selection query**

Use Drizzle to read only eligible rows:

```ts
.where(eq(submissions.status, "completed"))
```

plus explicit checks that `roasts.headline` is present and `roasts.score` is present, then order by `score asc` and `submissions.createdAt desc`.

- [ ] **Step 3: Implement the top-20 entries query**

Read at most 20 eligible rows, then map them to include:

```ts
rank: index + 1,
score: Number(row.score),
lines: row.sourceCode.split("\n").length,
```

and the roast text chosen in the spec.

Use `roasts.headline` as the always-visible roast text and fall back to `roasts.summary` only if the UI needs a secondary line later; do not concatenate or invent a fallback string in this v1.

- [ ] **Step 4: Implement the aggregate stats query in parallel**

Use `Promise.all(...)` for independent reads and compute:

```ts
stats: {
  totalEntries,
  averageScore,
}
```

from the full eligible dataset before the 20-item limit is applied.

- [ ] **Step 5: Preserve graceful degradation**

Return this fallback on backend failure to match the approved spec:

```ts
{
  entries: [],
  stats: { totalEntries: 0, averageScore: 0 },
}
```

- [ ] **Step 6: Expose `leaderboard.page` from the router**

Update `src/server/api/routers/leaderboard.ts` to include:

```ts
page: publicProcedure.query(async () => getLeaderboardPageData()),
```

using the actual exported service function name you create.

### Task 3: Share language normalization and preserve homepage behavior

**Files:**
- Modify: `src/server/api/services/leaderboard-service.ts` or create a colocated shared util if the file becomes too noisy
- Modify: `src/app/_components/homepage-leaderboard.tsx`
- Modify: `src/app/leaderboard/_components/leaderboard-page-card.tsx`

- [ ] **Step 1: Extract the language-to-`BundledLanguage` helper to one shared location**

Move the existing normalization logic out of `src/app/_components/homepage-leaderboard.tsx` into a shared server-safe utility such as:

```ts
export function getCodeBlockLanguage(language: string): BundledLanguage {
  switch (language) {
    case "javascript":
    case "typescript":
    case "sql":
    case "python":
    case "java":
    case "csharp":
    case "go":
    case "rust":
    case "php":
      return language;
    default:
      return "text" as BundledLanguage;
  }
}
```

- [ ] **Step 2: Update the homepage leaderboard to import the shared helper**

Keep behavior identical; this change should be refactor-only for the homepage.

- [ ] **Step 3: Use the shared helper in the dedicated page card**

Ensure the page card renders syntax highlighting safely for unknown languages.

### Task 4: Build the server-first leaderboard page UI

**Files:**
- Modify: `src/app/leaderboard/page.tsx`
- Create: `src/app/leaderboard/_components/leaderboard-page-content.tsx`
- Create: `src/app/leaderboard/_components/leaderboard-page-card.tsx`
- Create: `src/app/leaderboard/_components/leaderboard-page-skeleton.tsx`
- Reuse or modify: `src/app/_components/homepage-leaderboard-code-preview.tsx`

- [ ] **Step 1: Create the page skeleton component**

Mirror the real layout with header stats placeholders and several card shells so the `Suspense` fallback preserves spacing.

- [ ] **Step 2: Build `leaderboard-page-card.tsx` as an async server component**

Render one card with:

```tsx
<CodeBlock chrome={false} code={previewCode} lang={codeLanguage} />
```

for the preview and a second `CodeBlock` for the full content, passing both into the existing collapsible client wrapper.

- [ ] **Step 3: Keep the roast always visible**

Render the roast content below the code preview/full block in the card body using the existing terminal tone classes.

- [ ] **Step 4: Build `leaderboard-page-content.tsx`**

Accept resolved data as props and render:

```tsx
type LeaderboardPageContentProps = {
  data: LeaderboardPageData;
};
```

with the real top stats, the 20-card list, and the empty state when `entries.length === 0`.

- [ ] **Step 5: Apply value formatting in the server-first content layer**

Render values exactly as approved:

```ts
entry.score.toFixed(1)
data.stats.averageScore.toFixed(1)
data.stats.totalEntries.toLocaleString()
```

with `/10` appended only in the UI label.

- [ ] **Step 6: Finish `src/app/leaderboard/page.tsx`**

Compose the page with a nested async server section so `Suspense` can actually show the fallback, for example:

```tsx
async function LeaderboardPageSection() {
  const { data, dehydratedState } = await getCachedLeaderboardQueryState();

  return (
    <HydrationBoundary state={dehydratedState}>
      <LeaderboardPageContent data={data} />
    </HydrationBoundary>
  );
}

export default async function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardPageSkeleton />}>
      <LeaderboardPageSection />
    </Suspense>
  );
}
```

This keeps `HydrationBoundary` in the route flow required by the spec while still rendering the list server-first.

- [ ] **Step 7: Reuse the homepage collapse threshold**

Keep the closed state at 6 lines and hide the trigger for code blocks with 6 lines or fewer.

### Task 5: Keep tRPC hydration aligned without making the page client-heavy

**Files:**
- Modify: `src/app/leaderboard/page.tsx`
- Reference: `src/app/_components/homepage-leaderboard-section.tsx`
- Reference: `src/trpc/server.ts`

- [ ] **Step 1: Keep the required hydration flow without adding a client-heavy list**

The spec requires the App Router flow with `trpc.leaderboard.page.queryOptions()`, query prefetch/fetch, `dehydrate(queryClient)`, and `HydrationBoundary`. Keep that route-level pattern even though the rendered list stays server-first.

- [ ] **Step 2: If hydration is kept, wire it exactly once**

Use the established pattern:

```tsx
const queryClient = getQueryClient();
const queryOptions = trpc.leaderboard.page.queryOptions();
const data = await queryClient.fetchQuery(queryOptions);

<HydrationBoundary state={dehydrate(queryClient)}>
  <LeaderboardPageContent data={data} />
</HydrationBoundary>
```

and ensure the only client-heavy part remains the collapsible wrapper.

- [ ] **Step 3: Keep caching at the server-read boundary, not in the client wrapper**

The collapsible client component must remain a pure UI control and should not fetch or cache data itself.

### Task 6: Verify behavior and ship safely

**Files:**
- Modify: any files touched above

- [ ] **Step 1: Verify lint**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 2: Verify production build**

Run: `npm run build`

Expected: PASS, including App Router and server component compilation with cache components enabled.

- [ ] **Step 3: Manually verify leaderboard behaviors**

Check all of the following in the running app:

```text
- page loads real stats and up to 20 ranked entries
- code preview collapses at 6 lines
- roast stays visible when code is collapsed
- empty state is stable when there is no eligible data
- unknown language falls back to plain text highlighting safely
```

- [ ] **Step 4: Commit the implementation**

Run:

```bash
git add next.config.ts src/app/leaderboard src/app/_components/homepage-leaderboard.tsx src/server/api/routers/leaderboard.ts src/server/api/services/leaderboard-service.ts
git commit -m "feat: implement cached leaderboard page"
```
