import { LeaderboardPageShell } from "./_components/leaderboard-page-shell";
import { LeaderboardPageSkeleton } from "./_components/leaderboard-page-skeleton";

export default function LeaderboardLoading() {
  return (
    <LeaderboardPageShell>
      <LeaderboardPageSkeleton />
    </LeaderboardPageShell>
  );
}
