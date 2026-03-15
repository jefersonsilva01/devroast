import { createHighlighter, type Highlighter } from "shiki";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
	code: string;
	language?: string;
	className?: string;
}

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighterInstance(): Promise<Highlighter> {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ["vesper"],
			langs: [
				"javascript",
				"typescript",
				"python",
				"rust",
				"go",
				"java",
				"c",
				"cpp",
				"csharp",
				"ruby",
				"php",
				"swift",
				"kotlin",
				"sql",
				"html",
				"css",
				"json",
				"yaml",
				"markdown",
			],
		});
	}
	return highlighterPromise;
}

export async function CodeBlock({
	code,
	language = "typescript",
	className,
}: CodeBlockProps) {
	const hl = await getHighlighterInstance();
	const html = hl.codeToHtml(code, {
		lang: language,
		theme: "vesper",
	});

	return (
		<div
			className={cn(
				"block rounded-md border border-border-primary bg-bg-input font-mono text-sm",
				className,
			)}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
