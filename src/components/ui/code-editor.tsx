"use client";

import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface CodeEditorProps {
	value: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
}

export function CodeEditor({
	value,
	onChange,
	placeholder = "Paste your code here...",
	readOnly = false,
	className,
}: CodeEditorProps) {
	const id = useId();
	const lineNumbers = useMemo(() => {
		const lines = value.split("\n").length;
		return Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1);
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<div
			className={cn(
				"flex h-[360px] w-full overflow-hidden rounded-md border border-border-primary bg-bg-input",
				className,
			)}
		>
			{/* Line numbers */}
			<div
				className="flex flex-col border-r border-border-primary bg-bg-surface py-4 pr-3 text-right text-xs text-text-tertiary font-mono"
				aria-hidden="true"
			>
				{lineNumbers.map((num) => (
					<div key={num} className="leading-6">
						{num}
					</div>
				))}
			</div>

			{/* Code input */}
			<textarea
				id={id}
				value={value}
				onChange={handleChange}
				readOnly={readOnly}
				placeholder={placeholder}
				className="flex-1 resize-none border-0 bg-transparent p-4 font-mono text-sm leading-6 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0"
				spellCheck={false}
			/>
		</div>
	);
}
