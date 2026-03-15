import { Suspense } from "react";
import { GlobalMetrics } from "@/components/global-metrics";
import { LeaderboardPageSkeleton } from "@/components/leaderboard-page-skeleton";
import { CodeBlock } from "@/components/ui/code-block";
import { createCaller } from "@/server/routers/_app";

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

export const metadata = {
	title: "Leaderboard | devroast",
	description: "The most roasted code on the internet",
};

export default function LeaderboardPage() {
	return (
		<main className="flex min-h-screen flex-col bg-bg-page px-5 py-10 md:px-20">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-3">
						<span className="font-mono text-3xl font-bold text-accent-green">
							&gt;
						</span>
						<h1 className="font-mono text-3xl font-bold text-text-primary">
							shame_leaderboard
						</h1>
					</div>
					<p className="font-mono text-sm text-text-secondary">
						the worst code on the internet, ranked by shame
					</p>
					<Suspense fallback={<LeaderboardPageStatsSkeleton />}>
						<LeaderboardStats />
					</Suspense>
				</section>

				<Suspense fallback={<LeaderboardPageSkeleton />}>
					<LeaderboardList />
				</Suspense>
			</div>
		</main>
	);
}

function LeaderboardPageStatsSkeleton() {
	return (
		<div className="flex items-center gap-2">
			<span className="h-4 w-16 animate-pulse rounded bg-text-tertiary/20" />
			<span className="font-mono text-xs text-text-tertiary">submissions</span>
			<span className="font-mono text-xs text-text-tertiary">·</span>
			<span className="h-4 w-12 animate-pulse rounded bg-text-tertiary/20" />
			<span className="font-mono text-xs text-text-tertiary">avg score</span>
		</div>
	);
}

async function LeaderboardStats() {
	const caller = createCaller({});
	const { totalSubmissions, averageScore } = await caller.getGlobalMetrics();

	return (
		<GlobalMetrics
			totalSubmissions={totalSubmissions}
			averageScore={averageScore}
		/>
	);
}

async function LeaderboardList() {
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
