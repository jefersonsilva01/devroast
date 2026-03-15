# DevRoast

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Biome (lint/format)
- Shiki (syntax highlighting)
- Radix UI (base-ui)
- tRPC v11 (API layer)
- Drizzle ORM (database)

## Padrões de Código

### Componentes UI
- Localização: `src/components/ui/`
- Named exports sempre
- Usar `tailwind-variants` para variantes
- Usar `cn` de `@/lib/utils` para mesclar classes

### Padrão Composição
```tsx
<Component>
  <Component.SubComponent>...</Component.SubComponent>
</Component>
```

### Server/Client Components
- `"use client"` apenas quando necessário
- CodeBlock, DiffBlock = Server Components
- CodeEditor, Toggle = Client Components
- Dados do banco/API = Server Components com fetch direto ou via tRPC caller

### Variáveis Tailwind
- Usar variantes do theme: `bg-accent-green`, `text-text-primary`, etc.
- Não usar cores hardcoded

## Estrutura Pastas
```
src/
├── app/              # Next.js pages
│   ├── api/          # API routes (inclui tRPC)
│   └── *             # Pages (Server Components)
├── components/
│   ├── ui/           # Componentes genéricos
│   └── *.tsx         # Componentes específicos
├── lib/              # Utilitários
│   └── trpc/         # tRPC client setup
├── server/           # tRPC server
│   ├── context.ts    # Contexto
│   └── routers/      # Procedures
├── db/               # Database (Drizzle)
└── specs/            # Especificações de features
```

## tRPC

### Estrutura
- Servidor: `src/server/routers/_app.ts`
- API Route: `src/app/api/trpc/[trpc]/route.ts`
- Client (Server): `src/lib/trpc/server-client.ts`
- Client (Browser): `src/lib/trpc/client-provider.tsx`

### Padrões
- Procedures: usar `t.procedure.query()` ou `t.procedure.mutation()`
- Server Components: usar `createCaller()` para chamar procedures
- Client Components: usar hooks do `trpc` via provider
- Loading states: não usar Suspense/Skeleton para dados já fetcheados no servidor; usar valor inicial 0 e animated via client component

## Database (Drizzle)

### Estrutura
- Schema: `src/db/schema.ts`
- Queries: `src/db/queries.ts`
- Conexão: `src/db/index.ts`

### Padrões
- Queries como funções exportadas (não repository pattern)
- Tipos inferidos: `type Submission = typeof submissions.$inferSelect`
