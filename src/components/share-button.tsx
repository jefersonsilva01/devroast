"use client";

import { useState } from "react";

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
      const wasm = await import("@takumi-rs/wasm");
      const { fromJsx } = await import("@takumi-rs/helpers/jsx");

      await wasm.default();
      const renderer = new wasm.Renderer();

      // Load JetBrains Mono font (from jsDelivr CDN)
      const monoFontData = await fetch(
        "https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.19/files/jetbrains-mono-latin-400-normal.woff2",
      ).then((r) => r.arrayBuffer());
      (renderer as unknown as { loadFont: (f: unknown) => void }).loadFont({
        name: "JetBrains Mono",
        data: monoFontData,
        weight: 400,
        style: "normal",
      });

      // Load Inter font (from jsDelivr CDN)
      const interFontData = await fetch(
        "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.1.0/files/inter-latin-400-normal.woff2",
      ).then((r) => r.arrayBuffer());
      (renderer as unknown as { loadFont: (f: unknown) => void }).loadFont({
        name: "Inter",
        data: interFontData,
        weight: 400,
        style: "normal",
      });

      const { node, stylesheets } = await fromJsx(
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  color: "#22c55e",
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: "JetBrains Mono",
                }}
              >
                &gt;
              </span>
              <span
                style={{
                  color: "#f4f4f5",
                  fontSize: 20,
                  fontWeight: 500,
                  fontFamily: "JetBrains Mono",
                }}
              >
                devroast
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
              <span
                style={{
                  color: "#f59e0b",
                  fontSize: 160,
                  fontWeight: 900,
                  lineHeight: 1,
                  fontFamily: "JetBrains Mono",
                }}
              >
                {score.toFixed(1)}
              </span>
              <span
                style={{
                  color: "#71717a",
                  fontSize: 56,
                  lineHeight: 1,
                  fontFamily: "JetBrains Mono",
                }}
              >
                /10
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                  fontFamily: "JetBrains Mono",
                }}
              >
                {verdict}
              </span>
            </div>

            <span
              style={{
                color: "#71717a",
                fontSize: 16,
                fontFamily: "JetBrains Mono",
              }}
            >
              lang: {language} · {lines} lines
            </span>

            <span
              style={{
                color: "#f4f4f5",
                fontSize: 22,
                lineHeight: 1.5,
                textAlign: "center",
                fontFamily: "Inter",
              }}
            >
              "{roastTitle}"
            </span>
          </div>
        </div>,
      );

      const dataUrl = renderer.renderAsDataUrl(node, {
        width: 1200,
        height: 630,
        format: "png",
        stylesheets,
      });

      // Convert data URL to blob for download
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Create temporary link for download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `devroast-${score.toFixed(1)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(blobUrl);
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
