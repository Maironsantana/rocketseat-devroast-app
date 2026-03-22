import type * as React from "react";

type LeaderboardPageShellProps = {
  children: React.ReactNode;
};

export function LeaderboardPageShell({ children }: LeaderboardPageShellProps) {
  return (
    <main className="px-6 py-10 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 lg:px-10">
        {children}
      </div>
    </main>
  );
}
