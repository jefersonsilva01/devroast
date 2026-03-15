import { ShareButton } from "@/components/share-button";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import type { RoastAnalysis } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { createCaller } from "@/server/routers/_app";

interface SubmissionResult {
	id: string;
	code: string;
	language: string;
	roastMode: boolean;
	score: number;
	roastMessage: string;
	verdict: string;
	issues: RoastAnalysis["issues"];
	suggestedFix: RoastAnalysis["suggestedFix"];
	createdAt: Date;
}

function IssueCard({
	severity,
	title,
	description,
}: {
	severity: "critical" | "warning" | "good";
	title: string;
	description: string;
}) {
	const severityConfig: Record<
		string,
		{ dot: string; label: string; labelColor: string }
	> = {
		critical: {
			dot: "bg-accent-red",
			label: "critical",
			labelColor: "text-accent-red",
		},
		error: {
			dot: "bg-accent-red",
			label: "error",
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
		info: {
			dot: "bg-accent-green",
			label: "info",
			labelColor: "text-accent-green",
		},
	};

	const config = severityConfig[severity] ?? severityConfig.warning;

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

function DiffPreview({
	result,
}: {
	result: {
		suggestedFix: { removed: string[]; added: string[] };
	};
}) {
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
	const { id } = await params;
	const caller = createCaller({});

	try {
		const result = await caller.getSubmission({ id });
		return {
			title: `Roast Result | devroast`,
			description: `Score: ${result.score}/10`,
		};
	} catch {
		return {
			title: "Roast Result | devroast",
			description: "Submission not found",
		};
	}
}

export default async function ResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const caller = createCaller({});

	let submission: SubmissionResult;
	try {
		const result = await caller.getSubmission({ id });
		submission = {
			...result,
			createdAt: result.createdAt,
		};
	} catch {
		return (
			<main className="flex min-h-screen flex-col items-center justify-center bg-bg-page px-5">
				<p className="font-mono text-lg text-text-primary">
					Submission not found
				</p>
			</main>
		);
	}

	const result = {
		score: submission.score,
		verdict: submission.verdict.toLowerCase().replace(/\s+/g, "_"),
		roastTitle: submission.roastMessage,
		language: submission.language,
		lines: submission.code.split("\n").length,
		code: submission.code,
		issues: submission.issues,
		suggestedFix: submission.suggestedFix,
	};

	return (
		<main className="flex min-h-screen flex-col bg-bg-page px-5 py-10 md:px-20">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
				<section className="flex items-center gap-12">
					<ScoreRing score={result.score} />
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-accent-red" />
							<span className="font-mono text-sm font-medium text-accent-red">
								verdict: {result.verdict}
							</span>
						</div>
						<h1 className="font-mono text-xl leading-relaxed text-text-primary">
							{result.roastTitle}
						</h1>
						<div className="flex items-center gap-4">
							<span className="font-mono text-xs text-text-tertiary">
								lang: {result.language}
							</span>
							<span className="font-mono text-xs text-text-tertiary">
								{result.lines} lines
							</span>
						</div>
						<ShareButton
							score={result.score}
							verdict={result.verdict}
							roastTitle={result.roastTitle}
							language={result.language}
							lines={result.lines}
						/>
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
						code={result.code}
						language={result.language}
						lines={result.lines}
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
						{result.issues?.map((issue) => (
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
					<DiffPreview result={result} />
				</section>
			</div>
		</main>
	);
}
