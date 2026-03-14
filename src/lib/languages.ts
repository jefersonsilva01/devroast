import hljs from "highlight.js";

export const SUPPORTED_LANGUAGES = [
	{
		id: "javascript",
		name: "JavaScript",
		hljs: "javascript",
		patterns: ["const ", "let ", "function ", "=> ", "console.log"],
	},
	{
		id: "typescript",
		name: "TypeScript",
		hljs: "typescript",
		patterns: ["interface ", ": string", ": number", "type ", "as const"],
	},
	{
		id: "python",
		name: "Python",
		hljs: "python",
		patterns: ["def ", "import ", "from ", "print(", "self.", "if __name__"],
	},
	{
		id: "go",
		name: "Go",
		hljs: "go",
		patterns: ["func ", "package ", "import (", "fmt.", ":= ", "go "],
	},
	{
		id: "rust",
		name: "Rust",
		hljs: "rust",
		patterns: ["fn ", "let mut", "impl ", "pub fn", "-> ", "use std"],
	},
	{
		id: "java",
		name: "Java",
		hljs: "java",
		patterns: ["public class", "private ", "System.out", "void ", "extends "],
	},
	{
		id: "cpp",
		name: "C++",
		hljs: "cpp",
		patterns: ["#include", "std::", "cout <<", "endl", "int main"],
	},
	{
		id: "csharp",
		name: "C#",
		hljs: "csharp",
		patterns: [
			"using System",
			"namespace ",
			"public class",
			"Console.",
			"async Task",
		],
	},
	{
		id: "c",
		name: "C",
		hljs: "c",
		patterns: ["#include", "int main", "printf(", "malloc", "sizeof"],
	},
	{
		id: "ruby",
		name: "Ruby",
		hljs: "ruby",
		patterns: ["def ", "end", "puts ", "attr_", "require "],
	},
	{
		id: "php",
		name: "PHP",
		hljs: "php",
		patterns: ["<?php", "echo ", "function ", "$", "->"],
	},
	{
		id: "swift",
		name: "Swift",
		hljs: "swift",
		patterns: ["func ", "let ", "var ", "import Foundation", "guard "],
	},
	{
		id: "kotlin",
		name: "Kotlin",
		hljs: "kotlin",
		patterns: ["fun ", "val ", "var ", "println", "null"],
	},
	{
		id: "sql",
		name: "SQL",
		hljs: "sql",
		patterns: ["SELECT ", "FROM ", "WHERE ", "INSERT ", "CREATE TABLE"],
	},
	{
		id: "html",
		name: "HTML",
		hljs: "xml",
		patterns: ["<html", "<div", "<span", "<!DOCTYPE", "</"],
	},
	{
		id: "css",
		name: "CSS",
		hljs: "css",
		patterns: ["{", "}", "color:", "margin:", "padding:", ".class"],
	},
	{
		id: "json",
		name: "JSON",
		hljs: "json",
		patterns: ['{"', '": ', "true", "false", "null"],
	},
	{
		id: "yaml",
		name: "YAML",
		hljs: "yaml",
		patterns: ["- ", ": ", "true", "false", "null"],
	},
	{
		id: "markdown",
		name: "Markdown",
		hljs: "markdown",
		patterns: ["# ", "## ", "```", "**", "["],
	},
	{
		id: "bash",
		name: "Bash",
		hljs: "bash",
		patterns: ["#!/bin/bash", "echo ", "if [", "fi", "export "],
	},
] as const;

export type LanguageId = (typeof SUPPORTED_LANGUAGES)[number]["id"];

function detectByHeuristics(code: string): LanguageId | null {
	const lowerCode = code.toLowerCase();

	let bestMatch: { id: LanguageId; score: number } | null = null;

	for (const lang of SUPPORTED_LANGUAGES) {
		let score = 0;
		for (const pattern of lang.patterns) {
			if (lowerCode.includes(pattern.toLowerCase())) {
				score++;
			}
		}
		if (score > 0 && (!bestMatch || score > bestMatch.score)) {
			bestMatch = { id: lang.id, score };
		}
	}

	return bestMatch && bestMatch.score >= 1 ? bestMatch.id : null;
}

export function detectLanguage(code: string): LanguageId | null {
	if (!code || code.trim().length < 10) {
		return null;
	}

	const heuristicsResult = detectByHeuristics(code);
	if (heuristicsResult) {
		return heuristicsResult;
	}

	try {
		const result = hljs.highlightAuto(
			code,
			SUPPORTED_LANGUAGES.map((l) => l.hljs),
		);
		if (result.language) {
			const found = SUPPORTED_LANGUAGES.find(
				(l) => l.hljs === result.language || l.id === result.language,
			);
			return found?.id ?? null;
		}
	} catch {
		// Fallback to heuristics
	}

	return null;
}

export function highlightCode(code: string, languageId: LanguageId): string {
	const lang = SUPPORTED_LANGUAGES.find((l) => l.id === languageId);
	if (!lang) {
		return escapeHtml(code);
	}

	try {
		const result = hljs.highlight(code, { language: lang.hljs });
		return result.value;
	} catch {
		return escapeHtml(code);
	}
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
