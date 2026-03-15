"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Toggle } from "@/components/ui/toggle";
import { WindowHeader } from "@/components/window-header";
import type { LanguageId } from "@/lib/languages";
import { trpc } from "@/lib/trpc/client";

const MOCK_CODE = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

// TODO: handle tax calculation
// TODO: handle currency conversion
}`;

export function CodeEditorSection() {
	const router = useRouter();
	const [code, setCode] = useState(MOCK_CODE);
	const [language, setLanguage] = useState<LanguageId | "auto">("javascript");
	const [roastMode, setRoastMode] = useState(false);
	const MAX_LENGTH = 2000;
	const isOverLimit = code.length > MAX_LENGTH;

	const createRoast = trpc.createRoast.useMutation({
		onSuccess: (data) => {
			router.push(`/result/${data.id}`);
		},
		onError: (error) => {
			alert(`Error: ${error.message}`);
		},
	});

	return (
		<>
			{/* Code Editor Window */}
			<div className="mt-4 overflow-hidden rounded-md border border-border-primary bg-bg-input">
				<WindowHeader />
				<CodeEditor
					value={code}
					onChange={setCode}
					placeholder="Paste your code here..."
					maxLength={MAX_LENGTH}
				/>
			</div>

			{/* Language Selector */}
			<div className="flex items-center gap-2 py-2">
				<LanguageSelector value={language} onChange={setLanguage} />
			</div>

			{/* Actions Bar */}
			<div className="flex items-center justify-between py-2">
				<div className="flex items-center gap-4">
					<Toggle
						pressed={roastMode}
						onPressedChange={setRoastMode}
						aria-label="Toggle roast mode"
					>
						roast mode
					</Toggle>
					<span className="font-mono text-xs text-text-tertiary">
						{"//"} maximum sarcasm enabled
					</span>
				</div>
				<Button
					onClick={() => createRoast.mutate({ code, language, roastMode })}
					disabled={isOverLimit || createRoast.isPending}
				>
					{createRoast.isPending ? "roasting..." : "$ roast_my_code"}
				</Button>
			</div>
		</>
	);
}
