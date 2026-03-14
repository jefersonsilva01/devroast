"use client";

import Link from "next/link";
import { useState } from "react";
import { LeaderboardTableWithData } from "@/components/leaderboard-table";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { WindowHeader } from "@/components/window-header";

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

export default function HomePage() {
	const [code, setCode] = useState(MOCK_CODE);
	const [roastMode, setRoastMode] = useState(false);
	const MAX_LENGTH = 10000;
	const isOverLimit = code.length > MAX_LENGTH;

	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 py-8">
			{/* Hero Section */}
			<div className="flex w-full max-w-3xl flex-col gap-3">
				{/* Title */}
				<div className="flex items-center gap-3">
					<span className="font-mono text-[36px] font-bold text-accent-green">
						$
					</span>
					<span className="font-mono text-[36px] font-bold text-text-primary">
						paste your code. get roasted.
					</span>
				</div>

				{/* Subtitle */}
				<p className="font-mono text-sm text-text-secondary">
					{"//"} drop your code below and we&apos;ll rate it — brutally honest
					or full roast mode
				</p>

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
					<Button disabled={isOverLimit}>$ roast_my_code</Button>
				</div>

				{/* Stats */}
				<div className="flex justify-center gap-6 py-4">
					<span className="font-mono text-xs text-text-tertiary">
						2,847 codes roasted
					</span>
					<span className="font-mono text-xs text-text-tertiary">·</span>
					<span className="font-mono text-xs text-text-tertiary">
						avg score: 4.2/10
					</span>
				</div>
			</div>

			{/* Spacer */}
			<div className="h-16" />

			{/* Leaderboard Preview */}
			<Section>
				<Section.Title prefix="//">shame_leaderboard</Section.Title>
				<Section.Description>
					{"//"} the worst code on the internet, ranked by shame
				</Section.Description>
				<Section.Content>
					<div className="overflow-hidden rounded-md border border-border-primary">
						<LeaderboardTableWithData />
					</div>
				</Section.Content>
				<Link
					href="/leaderboard"
					className="px-4 py-3 text-center font-mono text-xs text-text-tertiary hover:text-text-secondary"
				>
					showing top 3 of 2,847 · view full leaderboard &gt;&gt;
				</Link>
			</Section>

			{/* Bottom Spacer */}
			<div className="h-16" />
		</main>
	);
}
