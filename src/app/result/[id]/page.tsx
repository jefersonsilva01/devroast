import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { cn } from "@/lib/utils";

const MOCK_RESULT = {
	score: 3.5,
	verdict: "needs_serious_help",
	roastTitle:
		'"this code looks like it was written during a power outage... in 2005."',
	language: "javascript",
	lines: 7,
	code: `var total = 0;
for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
}
return total;`,
	issues: [
		{
			severity: "critical",
			title: "using var instead of const/let",
			description:
				"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
		},
		{
			severity: "warning",
			title: "imperative loop pattern",
			description:
				"for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
		},
		{
			severity: "good",
			title: "clear naming conventions",
			description:
				"calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
		},
		{
			severity: "good",
			title: "single responsibility",
			description:
				"the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
		},
	],
	suggestedFix: {
		removed: [
			"  var total = 0;",
			"  for (var i = 0; i < items.length; i++) {",
			"    total = total + items[i].price;",
			"  }",
			"  return total;",
		],
		added: ["  return items.reduce((sum, item) => sum + item.price, 0);"],
	},
};

function IssueCard({
	severity,
	title,
	description,
}: {
	severity: "critical" | "warning" | "good";
	title: string;
	description: string;
}) {
	const severityConfig = {
		critical: {
			dot: "bg-accent-red",
			label: "critical",
			labelColor: "text-accent-red",
		},
		warning: {
			dot: "bg-accent-amber",
			label: "warning",
			labelColor: "text-accent-amber",
		},
		good: {
			dot: "bg-accent-green",
			label: "good",
			labelColor: "text-accent-green",
		},
	};

	const config = severityConfig[severity];

	return (
		<div className="flex flex-col gap-3 rounded-md border border-border-primary p-5">
			<div className="flex items-center gap-2">
				<div className={cn("h-2 w-2 rounded-full", config.dot)} />
				<span
					className={cn("font-mono text-xs font-medium", config.labelColor)}
				>
					{config.label}
				</span>
			</div>
			<h3 className="font-mono text-sm font-medium text-text-primary">
				{title}
			</h3>
			<p className="font-mono text-xs leading-relaxed text-text-secondary">
				{description}
			</p>
		</div>
	);
}

function CodePreview({
	code,
	language,
	lines,
}: {
	code: string;
	language: string;
	lines: number;
}) {
	const codeLines = code.split("\n");

	return (
		<div className="flex flex-col rounded-md border border-border-primary bg-bg-input">
			<div className="flex h-10 shrink-0 items-center justify-between border-b border-border-primary px-4">
				<span className="font-mono text-sm text-text-primary">
					your_submission
				</span>
				<span className="font-mono text-xs text-text-tertiary">
					{lines} lines
				</span>
			</div>
			<div className="flex">
				<div className="flex flex-col border-r border-border-primary bg-bg-surface px-3.5 py-3">
					{codeLines.map((_, i) => {
						const lineNum = i + 1;
						return (
							<span
								key={`line-${lineNum}`}
								className="font-mono text-xs leading-6 text-text-tertiary text-right"
							>
								{lineNum}
							</span>
						);
					})}
				</div>
				<div className="flex-1 overflow-x-auto p-4">
					<CodeBlock
						code={code}
						language={language}
						className="border-0 bg-transparent p-0 text-sm leading-6"
					/>
				</div>
			</div>
		</div>
	);
}

function DiffPreview({ result }: { result: typeof MOCK_RESULT }) {
	type DiffLine = {
		id: string;
		type: "context" | "removed" | "added";
		content: string;
	};

	const allLines: DiffLine[] = [];

	result.suggestedFix.removed.forEach((line, idx) => {
		allLines.push({ id: `removed-${idx}`, type: "removed", content: line });
	});
	result.suggestedFix.added.forEach((line, idx) => {
		allLines.push({ id: `added-${idx}`, type: "added", content: line });
	});

	return (
		<div className="flex flex-col rounded-md border border-border-primary bg-bg-input">
			<div className="flex h-10 shrink-0 items-center border-b border-border-primary px-4">
				<span className="font-mono text-xs text-text-secondary">
					your_code.ts → improved_code.ts
				</span>
			</div>
			<div className="flex flex-col">
				{allLines.map((line) => (
					<div
						key={line.id}
						className={cn(
							"flex font-mono text-sm leading-7",
							line.type === "removed" && "bg-accent-red/10 text-accent-red",
							line.type === "added" && "bg-accent-green/10 text-accent-green",
						)}
					>
						<span className="w-5 shrink-0 text-right pr-3 text-text-tertiary">
							{line.type === "removed"
								? "-"
								: line.type === "added"
									? "+"
									: " "}
						</span>
						<span className="flex-1">{line.content}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await params;
	return {
		title: "Roast Result | devroast",
		description: `Check out your roast result - Score: ${MOCK_RESULT.score}/10`,
	};
}

export default async function ResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await params;

	return (
		<main className="flex min-h-screen flex-col bg-bg-page px-5 py-10 md:px-20">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
				<section className="flex items-center gap-12">
					<ScoreRing score={MOCK_RESULT.score} />
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-accent-red" />
							<span className="font-mono text-sm font-medium text-accent-red">
								verdict: {MOCK_RESULT.verdict}
							</span>
						</div>
						<h1 className="font-mono text-xl leading-relaxed text-text-primary">
							{MOCK_RESULT.roastTitle}
						</h1>
						<div className="flex items-center gap-4">
							<span className="font-mono text-xs text-text-tertiary">
								lang: {MOCK_RESULT.language}
							</span>
							<span className="font-mono text-xs text-text-tertiary">
								{MOCK_RESULT.lines} lines
							</span>
						</div>
						<button
							type="button"
							className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border-primary px-4 py-2 font-mono text-xs text-text-primary hover:bg-bg-surface"
						>
							share_roast
						</button>
					</div>
				</section>

				<div className="h-px w-full bg-border-primary" />

				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{/* // */}
						</span>
						<h2 className="font-mono text-sm font-bold text-text-primary">
							your_submission
						</h2>
					</div>
					<CodePreview
						code={MOCK_RESULT.code}
						language={MOCK_RESULT.language}
						lines={MOCK_RESULT.lines}
					/>
				</section>

				<div className="h-px w-full bg-border-primary" />

				<section className="flex flex-col gap-6">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{/* // */}
						</span>
						<h2 className="font-mono text-sm font-bold text-text-primary">
							detailed_analysis
						</h2>
					</div>
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						{MOCK_RESULT.issues.map((issue) => (
							<IssueCard
								key={issue.title}
								severity={issue.severity as "critical" | "warning" | "good"}
								title={issue.title}
								description={issue.description}
							/>
						))}
					</div>
				</section>

				<div className="h-px w-full bg-border-primary" />

				<section className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{/* // */}
						</span>
						<h2 className="font-mono text-sm font-bold text-text-primary">
							suggested_fix
						</h2>
					</div>
					<DiffPreview result={MOCK_RESULT} />
				</section>
			</div>
		</main>
	);
}
