# Padrões de Páginas

## Estrutura

```
src/app/
├── api/              # API routes
│   └── trpc/         # tRPC handler
├── page.tsx          # Home page (Server Component)
├── layout.tsx        # Root layout
├── globals.css       # Estilos globais
└── AGENTS.md         # Este arquivo
```

## Páginas (Server Components)

### Padrão: Página com dados

```tsx
// src/app/page.tsx
import { ExampleWithData } from "@/components/example-with-data";

export default function Page() {
  return (
    <main>
      <ExampleWithData />
    </main>
  );
}
```

### Padrão: Página com interatividade

Para páginas que precisam de estado cliente, extrair a seção interativa para um Client Component.

```tsx
// src/app/page.tsx (Server Component)
import { InteractiveSection } from "@/components/interactive-section";

export default function Page() {
  return (
    <main>
      <InteractiveSection />
    </main>
  );
}
```

```tsx
// src/components/interactive-section.tsx (Client Component)
"use client";

import { useState } from "react";

export function InteractiveSection() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

## Layout Root

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { TRPCProviderWrapper } from "@/lib/trpc/client-provider";
import "./globals.css";

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
      <body className="antialiased">
        <Navbar />
        <TRPCProviderWrapper>
          {children}
        </TRPCProviderWrapper>
      </body>
    </html>
  );
}
```

## Regras

1. **Pages**: Sempre Server Components, usar `"use client"` apenas em componentes children
2. **Layout**: Wrap children com providers necessários (TRPCProvider, etc)
3. **Interatividade**: Extrair para Client Components separados
4. **Dados**: Buscar dados diretamente no Server Component via tRPC caller
