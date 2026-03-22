import { initTRPC } from "@trpc/server";

import { db } from "@/db/client";

type CreateTRPCContextOptions = {
  headers: Headers;
};

export async function createTRPCContext({ headers }: CreateTRPCContextOptions) {
  return {
    db,
    headers,
  };
}

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
