# Padrões de Componentes

## Estrutura

```
src/components/
├── ui/                 # Componentes genéricos (ver src/components/ui/AGENTS.md)
├── *.tsx              # Componentes específicos do projeto
└── AGENTS.md          # Este arquivo
```

## Server Components com Dados

### Padrão: Buscar dados e renderizar

```tsx
// src/components/example-with-data.tsx
import { createCaller } from "@/server/routers/_app";
import { ExampleComponent } from "./example-component";

export async function ExampleWithData() {
  const caller = createCaller({});
  const data = await caller.getData();

  return <ExampleComponent data={data} />;
}
```

### Padrão: Componente com animação de loading

```tsx
// src/components/example.tsx
"use client";

import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format?: Intl.NumberFormatOptions;
}

function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatted = new Intl.NumberFormat("en-US", format).format(displayValue);

  return <span>{formatted}</span>;
}
```

## Regras

1. **Dados do banco**: Server Components fazem fetch direto via `createCaller()`
2. **Loading states**: Usar valor inicial 0 com useState + useEffect para animação
3. **Não usar Suspense/Skeleton**: Para dados já fetcheados no servidor
4. **Client Components**: Adicionar `"use client"` apenas se houver interatividade (useState, useEffect, event handlers)
