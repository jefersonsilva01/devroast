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
			const init = (await import("@takumi-rs/wasm")).default;
			const { fromJsx } = await import("@takumi-rs/helpers/jsx");

			await init();
			const renderer = new (await import("@takumi-rs/wasm")).Renderer();

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
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

						<div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
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
									fontFamily: "monospace",
								}}
							>
								{verdict}
							</span>
						</div>

						<span
							style={{
								color: "#71717a",
								fontSize: 16,
								fontFamily: "monospace",
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
								fontFamily: "sans-serif",
							}}
						>
							"{roastTitle}"
						</span>
					</div>
				</div>,
			);

			const dataUrl = renderer.renderAsDataUrl(node as never, {
				width: 1200,
				height: 630,
				format: "png",
			});

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
