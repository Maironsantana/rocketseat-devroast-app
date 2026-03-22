# API Layer Notes

- `src/server/api` owns the tRPC backend layer.
- Keep routers thin: validate input, call services, return typed output.
- Put database access and business rules in `services/`, not directly inside procedures when the logic is reusable or non-trivial.
- Use `publicProcedure` by default until auth exists.
- Keep routers organized by domain and compose them in `root.ts`.
- Use Drizzle through the shared context instead of creating ad-hoc database clients.
