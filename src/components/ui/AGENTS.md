# Padrões de Componentes UI

## Estrutura de Arquivos

- Localização: `src/components/ui/`
- Naming: kebab-case (ex: `button.tsx`, `text-field.tsx`)
- Sempre usar **named exports**, nunca default exports

## Tipos de Componentes

### Client Component (interativo)
```tsx
"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface ComponentNameProps {
  className?: string;
}

export function ComponentName({ className }: ComponentNameProps) {
  const id = useId();

  return <div className={cn(className)} />;
}
```

### Server Component (apenas renderização)
```tsx
import { cn } from "@/lib/utils";

export interface ComponentNameProps {
  className?: string;
}

export function ComponentName({ className }: ComponentNameProps) {
  return <div className={cn(className)} />;
}
```

### Componente com variantes (Client/Server)
```tsx
import { forwardRef, type ElementHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const componentNameVariants = tv({
  base: "classes base compartilhadas",
  variants: {
    variant: {
      default: "classes para variante default",
      secondary: "classes para variante secondary",
    },
    size: {
      default: "classes para tamanho default",
      sm: "classes para tamanho small",
      lg: "classes para tamanho large",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ComponentNameProps
  extends ElementHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentNameVariants> {}

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(componentNameVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

ComponentName.displayName = "ComponentName";
```

## Regras

1. **Dependências**: Usar `clsx`, `tailwind-merge` e `tailwind-variants`
2. **Utils**: Usar função `cn` de `@/lib/utils` para mesclar classes
3. **Tipagem**: Sempre estender propriedades nativas do elemento HTML correspondente
4. **ForwardRef**: Usar `forwardRef` para permitir ref forwarding
5. **DisplayName**: Definir `displayName` após o componente
6. **Variantes**: Definir variantes no padrão `variant` e `size`
7. **Tailwind**: Usar classes utilitárias do Tailwind
8. **Client Components**: Adicionar `"use client"` no topo do arquivo
9. **Server Components**: Não adicionar `"use client"`, renderizar no servidor

## Biblioteca de Componentes

- **Comportamento interativo**: Usar `@radix-ui/react-*` (base-ui)
  - Toggle, Checkbox, Dropdown, Dialog, etc.
- **Highlighting de código**: Usar `shiki` com tema `vesper`
  - Server component apenas

## Criar Utils (se não existir)

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
