# OG Image Generation Feature Design

**Date:** 2026-03-15  
**Topic:** Browser-based OG Image Generation for Roast Results

## Overview

Generate Open Graph images for roast result pages directly in the user's browser using WebAssembly. When users click "share_roast", an image matching the Pencil design is generated and opened in a new tab for copying/sharing.

## Requirements

1. Generate images on-demand (when user clicks share)
2. Execute in the browser (client-side)
3. Use the design from Pencil frame "Screen 4 - OG Image" (1200x630)

## Architecture

```
Result Page (Server)    OG Image Generator (Client)    New Tab
    │                            │                        │
    │ data: score, verdict,     │                        │
    │ roastTitle, language,     │                        │
    │ lines                     │                        │
    ▼                            ▼                        │
Database ───────────▶  takumi-rs/wasm (WASM) ──────▶  PNG (data URL)
(submissions)            ~1MB loaded on demand
```

## Components

### New: `src/components/share-button.tsx`

**Client Component** that:
1. Loads WASM module on first use (~1MB)
2. Builds JSX structure matching Pencil design using inline styles
3. Renders to data URL via `renderer.renderAsDataUrl()`
4. Opens result in new tab for user to copy

```tsx
interface ShareButtonProps {
  score: number;
  verdict: string;
  roastTitle: string;
  language: string;
  lines: number;
}
```

### Design Implementation

The component replicates the Pencil frame "Screen 4 - OG Image" (frame ID: 4J5QT):

| Element | Style |
|---------|-------|
| Background | `#0a0a0b` ($bg-page) |
| Logo | `> devroast` - green `>` + white text |
| Score | Large amber number + `/10` gray |
| Verdict dot | Red ellipse + red text |
| Lang info | Gray monospace |
| Roast quote | White, centered, italic |

## Integration

### 1. Update Result Page

**File:** `src/app/result/[id]/page.tsx`

Replace static button with ShareButton component:

```tsx
<ShareButton 
  score={result.score} 
  verdict={result.verdict} 
  roastTitle={result.roastTitle}
  language={result.language}
  lines={result.lines}
/>
```

### 2. Install Dependencies

```bash
npm install @takumi-rs/wasm @takumi-rs/helpers
```

### 3. Next.js Configuration

**File:** `next.config.ts`

```ts
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};
```

## Error Handling

| Scenario | Handling |
|----------|----------|
| WASM load failure | Show error message, suggest refresh |
| First load (cold start) | Show "generating..." loading state |
| Memory optimization | Reuse renderer instance between calls |
| Fallback | Show toast with "Tale novamente" |

## Technical Details

- **Output format:** PNG (data URL)
- **Dimensions:** 1200x630 (standard OG)
- **WASM size:** ~1MB (loaded on demand)
- **Rendering time:** ~500ms after WASM loaded
- **Browser support:** Modern browsers with WASM support

## Testing Checklist

- [ ] WASM loads successfully on first click
- [ ] Image matches Pencil design exactly
- [ ] Works on Chrome, Firefox, Safari
- [ ] Loading state shows during generation
- [ ] Error handling works for failures
- [ ] Memory usage stable after multiple generations
