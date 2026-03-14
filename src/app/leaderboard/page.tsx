import { CodeBlock } from "@/components/ui/code-block";

interface LeaderboardEntry {
	rank: number;
	score: number;
	code: string;
	language: string;
	lines: number;
}

const MOCK_ENTRIES: LeaderboardEntry[] = [
	{
		rank: 1,
		score: 1.2,
		code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
		language: "javascript",
		lines: 3,
	},
	{
		rank: 2,
		score: 2.1,
		code: `if True:
    return False
# just vibes`,
		language: "python",
		lines: 3,
	},
	{
		rank: 3,
		score: 3.5,
		code: `const x = 1
x = 2 // who needs const?`,
		language: "typescript",
		lines: 2,
	},
	{
		rank: 4,
		score: 4.8,
		code: `while(true) { eat(); } // infinite pizza`,
		language: "javascript",
		lines: 1,
	},
	{
		rank: 5,
		score: 5.2,
		code: `function doNothing() {
  // TODO: implement
}`,
		language: "javascript",
		lines: 3,
	},
];

const TOTAL_SUBMISSIONS = "2,847";
const AVG_SCORE = "4.2";

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
						{/* the most roasted code on the internet */}
					</p>
					<div className="flex items-center gap-2">
						<span className="font-mono text-xs text-text-tertiary">
							{TOTAL_SUBMISSIONS} submissions
						</span>
						<span className="font-mono text-xs text-text-tertiary">·</span>
						<span className="font-mono text-xs text-text-tertiary">
							avg score: {AVG_SCORE}/10
						</span>
					</div>
				</section>

				<section className="flex flex-col gap-5">
					{MOCK_ENTRIES.map((entry) => (
						<LeaderboardEntryCard key={entry.rank} entry={entry} />
					))}
				</section>
			</div>
		</main>
	);
}
