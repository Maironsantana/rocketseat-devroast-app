import { drizzle } from "drizzle-orm/node-postgres";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://devroast:devroast@localhost:5432/devroast";

export const db = drizzle({
  connection: databaseUrl,
  casing: "snake_case",
});
