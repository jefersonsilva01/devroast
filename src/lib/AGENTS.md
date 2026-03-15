# Padrões de Código

## Estrutura

```
src/lib/
├── trpc/              # tRPC setup
│   ├── client-provider.tsx
│   ├── query-client.ts
│   └── server-client.ts
└── utils.ts           # Utilitários gerais
```

## tRPC

### Server Components

```tsx
// src/lib/trpc/server-client.ts
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { getQueryClient } from "./query-client";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";

export { getQueryClient };
export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});
```

### Client Components (Provider)

```tsx
// src/lib/trpc/client-provider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import type { AppRouter } from "@/server/routers/_app";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function TRPCProviderWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </TRPCProvider>
  );
}
```

## Utils

### cn (classnames)

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
