# OG Image Generation Feature Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate Open Graph images for roast result pages directly in the browser using WebAssembly (Takumi), matching the Pencil design frame "Screen 4 - OG Image".

**Architecture:** Client-side generation using `@takumi-rs/wasm`. When user clicks "share_roast", the component loads WASM (~1MB), builds JSX matching the design, renders to PNG data URL, and opens in new tab.

**Tech Stack:** Next.js 16, TypeScript, @takumi-rs/wasm, @takumi-rs/helpers

---

## File Structure

```
src/
├── components/
│   └── share-button.tsx    (NEW - Client Component)
├── app/
│   └── result/
│       └── [id]/
│           └── page.tsx    (MODIFY - replace static button)
├── next.config.ts          (MODIFY - add WASM support)
package.json               (MODIFY - add dependencies)
```

---

## Chunk 1: Setup

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Takumi packages**

Run:
```bash
npm install @takumi-rs/wasm @takumi-rs/helpers
```

Expected: Packages installed without errors

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add takumi wasm dependencies"
```

---

### Task 2: Configure Next.js for WASM

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Read current next.config.ts**

```bash
cat next.config.ts
```

- [ ] **Step 2: Add WASM support**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

export default nextConfig;
```

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "config: enable asyncWebAssembly for takumi"
```

---

## Chunk 2: Component Creation

### Task 3: Create ShareButton Component

**Files:**
- Create: `src/components/share-button.tsx`

- [ ] **Step 1: Create the ShareButton component**

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  score: number;
  verdict: string;
  roastTitle: string;
  language: string;
  lines: number;
}

export function ShareButton({
  score,
  verdict,
  roastTitle,
  language,
  lines,
}: ShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    setLoading(true);
    setError(null);

    try {
      // Dynamic import of WASM modules
      const init = (
        await import(/* @vite-ignore */ "@takumi-rs/wasm")
      ).default;
      const { fromJsx } = await import("@takumi-rs/helpers/jsx");

      // Initialize WASM (first time only, ~1MB)
      await init();
      const renderer = new (await import("@takumi-rs/wasm")).Renderer();

      // Build JSX matching Pencil frame "Screen 4 - OG Image"
      const node = await fromJsx(
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0b",
            gap: 28,
            padding: 64,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              width: "100%",
            }}
          >
            {/* Logo */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  color: "#22c55e",
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                &gt;
              </span>
              <span
                style={{
                  color: "#f4f4f5",
                  fontSize: 20,
                  fontWeight: 500,
                  fontFamily: "monospace",
                }}
              >
                devroast
              </span>
            </div>

            {/* Score */}
            <div
              style={{ display: "flex", alignItems: "flex-end", gap: 4 }}
            >
              <span
                style={{
                  color: "#f59e0b",
                  fontSize: 160,
                  fontWeight: 900,
                  lineHeight: 1,
                  fontFamily: "monospace",
                }}
              >
                {score.toFixed(1)}
              </span>
              <span
                style={{
                  color: "#71717a",
                  fontSize: 56,
                  lineHeight: 1,
                  fontFamily: "monospace",
                }}
              >
                /10
              </span>
            </div>

            {/* Verdict */}
            <div
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                }}
              />
              <span
                style={{
                  color: "#ef4444",
                  fontSize: 20,
                  fontFamily: "monospace",
                }}
              >
                {verdict}
              </span>
            </div>

            {/* Language info */}
            <span
              style={{
                color: "#71717a",
                fontSize: 16,
                fontFamily: "monospace",
              }}
            >
              lang: {language} · {lines} lines
            </span>

            {/* Roast quote */}
            <span
              style={{
                color: "#f4f4f5",
                fontSize: 22,
                lineHeight: 1.5,
                textAlign: "center",
                fontFamily: "sans-serif",
              }}
            >
              "{roastTitle}"
            </span>
          </div>
        </div>
      );

      // Generate data URL
      const dataUrl = renderer.renderAsDataUrl(node, {
        width: 1200,
        height: 630,
        format: "png",
      });

      // Open in new tab
      window.open(dataUrl, "_blank");
    } catch (err) {
      console.error("Failed to generate image:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border-primary px-4 py-2 font-mono text-xs text-text-primary hover:bg-bg-surface disabled:opacity-50"
      >
        {loading ? "generating..." : "share_roast"}
      </button>
      {error && (
        <span className="font-mono text-xs text-accent-red">{error}</span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/share-button.tsx
git commit -m "feat: add ShareButton component with takumi WASM"
```

---

## Chunk 3: Integration

### Task 4: Integrate ShareButton in Result Page

**Files:**
- Modify: `src/app/result/[id]/page.tsx`

- [ ] **Step 1: Read current page.tsx to find button location**

```bash
sed -n '250,270p' src/app/result/[id]/page.tsx
```

- [ ] **Step 2: Add import for ShareButton**

At top of file, after existing imports:
```tsx
import { ShareButton } from "@/components/share-button";
```

- [ ] **Step 3: Replace static button with ShareButton**

Find and replace:
```tsx
{/* Before (static button) */}
<button
  type="button"
  className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border-primary px-4 py-2 font-mono text-xs text-text-primary hover:bg-bg-surface"
>
  share_roast
</button>

{/* After (dynamic button) */}
<ShareButton
  score={result.score}
  verdict={result.verdict}
  roastTitle={result.roastTitle}
  language={result.language}
  lines={result.lines}
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/result/[id]/page.tsx
git commit -m "feat: integrate ShareButton in result page"
```

---

## Chunk 4: Verification

### Task 5: Verify Implementation

- [ ] **Step 1: Build the project**

Run:
```bash
npm run build
```

Expected: Build completes without errors

- [ ] **Step 2: Start dev server**

Run:
```bash
npm run dev
```

- [ ] **Step 3: Test in browser**

1. Open http://localhost:3000
2. Submit some code to create a roast
3. Navigate to result page
4. Click "share_roast" button
5. Verify new tab opens with correct OG image

- [ ] **Step 4: Test error handling**

Verify error message shows if WASM fails to load

- [ ] **Step 5: Run lint**

Run:
```bash
npm run lint
```

Expected: No errors

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: implement OG image generation for roast results"
```

---

## Expected Result

After implementation:
- User visits result page (e.g., `/result/[id]`)
- Clicks "share_roast" button
- Button shows "generating..." during WASM load
- New tab opens with PNG image matching Pencil design
- User can right-click and copy the image for sharing
