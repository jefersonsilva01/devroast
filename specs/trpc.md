# SPEC: tRPC + Next.js App Router

## 1. Visão Geral

- **API Layer**: tRPC com TanStack Query v5
- **Integração**: Next.js 16 App Router (Server Components)
- **Tipo**: End-to-end typesafe APIs

---

## 2. Dependências

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query
npm install -D @trpc/tests
```

---

## 3. Estrutura de Arquivos

```
src/
├── server/
│   ├── index.ts              # Inicialização do tRPC
│   ├── context.ts            # Contexto (req/res)
│   └── routers/
│       └── _app.ts           # Router principal
├── lib/
│   ├── trpc/
│   │   ├── client.ts         # Client singleton (server)
│   │   ├── server-client.ts  # Server components proxy
│   │   └── query-client.ts   # QueryClient factory
│   └── trpc.ts               # Exports centralizados
└── app/
    └── api/trpc/[trpc]/route.ts  # API Route handler
```

---

## 4. Setup

### 4.1 Server Context

```typescript
// src/server/context.ts
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createContext = ({ req, res }: FetchCreateContextFnOptions) => {
  return { req, res };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
```

### 4.2 Router Principal

```typescript
// src/server/routers/_app.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from '../context';

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  hello: t.procedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return { greeting: `Hello ${input.text}` };
  }),
  // ... routers
});

export type AppRouter = typeof appRouter;
```

### 4.3 API Route Handler

```typescript
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
```

---

## 5. Client (Server Components)

### 5.1 QueryClient + Proxy

```typescript
// src/lib/trpc/query-client.ts
'use server';
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export const makeQueryClient = () => new QueryClient();

export const getQueryClient = cache(makeQueryClient);
```

```typescript
// src/lib/trpc/server-client.ts
'use server';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { getQueryClient } from './query-client';
import { createContext } from '@/server/context';
import { appRouter } from '@/server/routers/_app';

export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});
```

### 5.2 Uso em Server Component

```typescript
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/lib/trpc/server-client';
import { ClientComponent } from './client-component';

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions({ text: 'world' })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
```

---

## 6. Client (Client Components)

### 6.1 Provider

```typescript
// src/lib/trpc/client-provider.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import type { AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 6.2 Uso em Client Component

```typescript
import { trpc } from '@/lib/trpc/client-provider';

function ClientComponent() {
  const { data } = trpc.hello.useQuery({ text: 'world' });
  return <div>{data?.greeting}</div>;
}
```

---

## 7. To-Dos

- [ ] Instalar dependências
- [ ] Criar server context
- [ ] Criar router com procedimentos de exemplo
- [ ] Criar API route handler
- [ ] Configurar server client (getQueryClient, createTRPCOptionsProxy)
- [ ] Criar TRPCProvider para client components
- [ ] Integrar TRPCProvider no layout root
- [ ] Testar comunicação server <-> client

---

## 8. Referências

- https://trpc.io/docs/client/tanstack-react-query/server-components
- https://trpc.io/docs/client/tanstack-react-query/setup
