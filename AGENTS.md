# DevRoast

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Biome (lint/format)
- Shiki (syntax highlighting)
- Radix UI (base-ui)

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

### Variáveis Tailwind
- Usar variantes do theme: `bg-accent-green`, `text-text-primary`, etc.
- Não usar cores hardcoded

## Estrutura Pastas
```
src/
├── app/           # Next.js pages
├── components/
│   ├── ui/       # Componentes genéricos
│   └── *.tsx     # Componentes específicos
└── lib/          # Utilitários
```
