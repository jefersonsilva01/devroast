# Padrões do Servidor

## tRPC Server

### Estrutura

```
src/server/
├── context.ts           # Contexto da requisição
└── routers/
    └── _app.ts          # Router principal (AppRouter)
```

### Context

```ts
// src/server/context.ts
export const createContext = () => {
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
```

### Router

```ts
// src/server/routers/_app.ts
import { initTRPC } from "@trpc/server";
import { getGlobalStats } from "@/db/queries";

const t = initTRPC.create();

export const appRouter = t.router({
  getGlobalMetrics: t.procedure.query(async () => {
    const stats = await getGlobalStats();
    return {
      totalSubmissions: stats.totalSubmissions,
      averageScore: stats.averageScore,
    };
  }),
});

export type AppRouter = typeof appRouter;
export const createCaller = t.createCallerFactory(appRouter);
```

### API Route

```ts
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
```

## Regras

1. **Procedures**: Usar `t.procedure.query()` ou `t.procedure.mutation()`
2. **Context**: Criar função `createContext` que retorna objeto vazio ou com dados da requisição
3. **Caller**: Exportar `createCaller` para uso em Server Components
4. **Tipagem**: Exportar `AppRouter` como `typeof appRouter`
5. **DB Queries**: Chamar funções de `src/db/queries.ts` diretamente nas procedures
