import { Suspense } from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { createCaller } from "@/server/routers/_app";
import { LeaderboardPageSkeleton } from "./leaderboard-page-skeleton";

interface LeaderboardEntry {
	rank: number;
	id: string;
	score: number;
	code: string;
	language: string;
	lines: number;
}

function LeaderboardEntryCard({ entry }: { entry: LeaderboardEntry }) {
	const lineHeight = 24;
	const minHeight = entry.lines * lineHeight + 48;

	return (
		<div className="flex flex-col rounded-md border border-border-primary bg-bg-page overflow-visible">
			<div className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-5">
				<div className="flex items-center gap-2">
					<span className="font-mono text-sm text-text-tertiary">#</span>
					<span className="font-mono text-sm font-bold text-accent-amber">
						{entry.rank}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="font-mono text-xs text-text-tertiary">score:</span>
					<span className="font-mono text-sm font-bold text-accent-red">
						{entry.score}
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="font-mono text-xs text-text-secondary">
						{entry.language}
					</span>
					<span className="font-mono text-xs text-text-tertiary">
						{entry.lines} lines
					</span>
				</div>
			</div>
			<div
				className="relative overflow-visible"
				style={{ minHeight: `${minHeight}px` }}
			>
				<div className="absolute left-0 top-0 flex h-full flex-col shrink-0 border-r border-border-primary bg-bg-surface px-3.5 py-4">
					{[...Array(entry.lines)].map((_, i) => {
						const lineNum = i + 1;
						return (
							<span
								key={lineNum}
								className="w-10 font-mono text-xs leading-6 text-text-tertiary text-right"
							>
								{lineNum}
							</span>
						);
					})}
				</div>
				<div className="pl-24 pr-5 py-4 overflow-x-auto overflow-y-visible">
					<CodeBlock
						code={entry.code}
						language={entry.language}
						className="border-0 bg-bg-input p-0 text-sm leading-6 whitespace-nowrap"
					/>
				</div>
			</div>
		</div>
	);
}

export function LeaderboardWithSuspense() {
	return (
		<Suspense fallback={<LeaderboardPageSkeleton />}>
			<LeaderboardData />
		</Suspense>
	);
}

async function LeaderboardData() {
	const caller = createCaller({});
	const entries = await caller.getLeaderboard({ limit: 20, offset: 0 });

	return (
		<section className="flex flex-col gap-5">
			{entries.map((entry) => (
				<LeaderboardEntryCard key={entry.id} entry={entry} />
			))}
		</section>
	);
}
