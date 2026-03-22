import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";

import { Button } from "@/components/ui";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "DevRoast",
  description: "Paste your code. Get roasted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        <TRPCReactProvider>
          <div className="min-h-screen bg-canvas-base text-foreground-inverse">
            <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-border-subtle bg-canvas-base/95 backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-6 md:px-10">
                <Link
                  className="font-mono flex items-center gap-2 text-lg font-medium"
                  href="/"
                >
                  <span className="text-accent-green">&gt;</span>
                  <span className="text-foreground-inverse">devroast</span>
                </Link>

                <nav className="flex items-center gap-3">
                  <Link href="/components">
                    <Button size="sm" variant="link">
                      $ components
                    </Button>
                  </Link>
                  <Link href="/leaderboard">
                    <Button size="sm" variant="link">
                      leaderboard
                    </Button>
                  </Link>
                </nav>
              </div>
            </header>

            <div className="pt-14">{children}</div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
