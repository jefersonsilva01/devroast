"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
	detectLanguage,
	highlightCode,
	type LanguageId,
	SUPPORTED_LANGUAGES,
} from "@/lib/languages";
import { cn } from "@/lib/utils";

export interface CodeEditorProps {
	value: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
	language?: LanguageId | "auto";
	onLanguageDetected?: (language: LanguageId | null) => void;
	maxLength?: number;
}

export function CodeEditor({
	value,
	onChange,
	placeholder = "Paste your code here...",
	readOnly = false,
	className,
	language: initialLanguage,
	onLanguageDetected,
	maxLength = 2000,
}: CodeEditorProps) {
	const id = useId();
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const highlightRef = useRef<HTMLDivElement>(null);

	const [language, setLanguage] = useState<LanguageId | "auto">(
		initialLanguage ?? "auto",
	);
	const [detectedLanguage, setDetectedLanguage] = useState<LanguageId | null>(
		null,
	);

	const effectiveLanguage = language === "auto" ? detectedLanguage : language;
	const isOverLimit = value.length > maxLength;

	const highlightedCode = useMemo(() => {
		if (!effectiveLanguage || !value) return "";
		return highlightCode(value, effectiveLanguage);
	}, [value, effectiveLanguage]);

	const lineNumbers = useMemo(() => {
		const lines = value.split("\n").length;
		return Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1);
	}, [value]);

	useEffect(() => {
		if (language === "auto" && value.length > 20) {
			const detected = detectLanguage(value);
			setDetectedLanguage(detected);
			onLanguageDetected?.(detected);
		}
	}, [value, language, onLanguageDetected]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		if (newValue.length <= maxLength) {
			onChange?.(newValue);
		}
	};

	const handleScroll = () => {
		if (textareaRef.current && highlightRef.current) {
			highlightRef.current.scrollTop = textareaRef.current.scrollTop;
			highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
		}
	};

	return (
		<div
			className={cn(
				"relative flex h-[360px] w-full overflow-hidden rounded-md border border-border-primary bg-bg-input font-mono text-sm",
				className,
			)}
		>
			{/* Line numbers */}
			<div
				className="flex flex-shrink-0 flex-col border-r border-border-primary bg-bg-surface py-4 pr-3 text-right text-xs text-text-tertiary"
				aria-hidden="true"
			>
				{lineNumbers.map((num) => (
					<div key={num} className="leading-6">
						{num}
					</div>
				))}
			</div>

			{/* Editor container */}
			<div className="relative flex-1 overflow-hidden">
				{/* Highlighted code layer (behind) */}
				<div
					ref={highlightRef}
					className="absolute inset-0 overflow-auto whitespace-pre-wrap break-words p-4 leading-6"
					aria-hidden="true"
				>
					<code
						className="text-text-primary"
						dangerouslySetInnerHTML={{
							__html: highlightedCode || "&nbsp;",
						}}
					/>
				</div>

				{/* Textarea layer (front) */}
				<textarea
					ref={textareaRef}
					id={id}
					value={value}
					onChange={handleChange}
					onScroll={handleScroll}
					readOnly={readOnly}
					placeholder={placeholder}
					className="absolute inset-0 h-full w-full resize-none bg-transparent p-4 leading-6 text-transparent caret-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0"
					spellCheck={false}
				/>
			</div>

			{/* Language selector and counter */}
			<div className="absolute bottom-2 right-2 flex items-center gap-3">
				<span
					className={cn(
						"font-mono text-xs",
						isOverLimit ? "text-accent-red" : "text-text-tertiary",
					)}
				>
					{value.length}/{maxLength}
				</span>
				<select
					value={language}
					onChange={(e) => setLanguage(e.target.value as LanguageId | "auto")}
					className="rounded border border-border-primary bg-bg-surface px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-green"
				>
					<option value="auto">auto</option>
					{SUPPORTED_LANGUAGES.map((lang) => (
						<option key={lang.id} value={lang.id}>
							{lang.name}
						</option>
					))}
				</select>
				{effectiveLanguage && (
					<span className="text-xs text-accent-green">
						{SUPPORTED_LANGUAGES.find((l) => l.id === effectiveLanguage)?.name}
					</span>
				)}
			</div>
		</div>
	);
}
