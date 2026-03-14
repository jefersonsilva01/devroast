import hljs from "highlight.js";

export const SUPPORTED_LANGUAGES = [
	{ id: "javascript", name: "JavaScript", hljs: "javascript" },
	{ id: "typescript", name: "TypeScript", hljs: "typescript" },
	{ id: "python", name: "Python", hljs: "python" },
	{ id: "go", name: "Go", hljs: "go" },
	{ id: "rust", name: "Rust", hljs: "rust" },
	{ id: "java", name: "Java", hljs: "java" },
	{ id: "cpp", name: "C++", hljs: "cpp" },
	{ id: "csharp", name: "C#", hljs: "csharp" },
	{ id: "c", name: "C", hljs: "c" },
	{ id: "ruby", name: "Ruby", hljs: "ruby" },
	{ id: "php", name: "PHP", hljs: "php" },
	{ id: "swift", name: "Swift", hljs: "swift" },
	{ id: "kotlin", name: "Kotlin", hljs: "kotlin" },
	{ id: "sql", name: "SQL", hljs: "sql" },
	{ id: "html", name: "HTML", hljs: "xml" },
	{ id: "css", name: "CSS", hljs: "css" },
	{ id: "json", name: "JSON", hljs: "json" },
	{ id: "yaml", name: "YAML", hljs: "yaml" },
	{ id: "markdown", name: "Markdown", hljs: "markdown" },
	{ id: "bash", name: "Bash", hljs: "bash" },
] as const;

export type LanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

export function detectLanguage(code: string): LanguageId | null {
	if (!code || code.trim().length < 10) {
		return null;
	}

	const result = hljs.highlightAuto(
		code,
		SUPPORTED_LANGUAGES.map((l) => l.hljs),
	);

	if (result.language && result.relevance >= 5) {
		const found = SUPPORTED_LANGUAGES.find(
			(l) => l.hljs === result.language || l.id === result.language,
		);
		return found?.id ?? null;
	}

	return null;
}

export function highlightCode(code: string, languageId: LanguageId): string {
	const lang = SUPPORTED_LANGUAGES.find((l) => l.id === languageId);
	if (!lang) {
		return code;
	}

	try {
		const result = hljs.highlight(code, { language: lang.hljs });
		return result.value;
	} catch {
		return code;
	}
}
