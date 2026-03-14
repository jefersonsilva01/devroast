import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface LeaderboardEntry {
	rank: number;
	score: number;
	code: string;
	language: string;
}

const MOCK_ENTRIES: LeaderboardEntry[] = [
	{
		rank: 1,
		score: 0.5,
		code: "function calculateTax() { return 42; }",
		language: "javascript",
	},
	{
		rank: 2,
		score: 1.2,
		code: "if (true) { return false; }",
		language: "python",
	},
	{ rank: 3, score: 1.8, code: "const x = 1; x = 2;", language: "typescript" },
];

function getScoreVariant(score: number): "error" | "warning" | "success" {
	if (score < 3) return "error";
	if (score < 6) return "warning";
	return "success";
}

const LeaderboardTableRoot = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return <div className={cn(className)}>{children}</div>;
};

const LeaderboardTableHeader = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				"flex h-10 w-full items-center border-b border-border-primary bg-bg-surface px-5",
				className,
			)}
		>
			<span className="w-12 font-mono text-xs text-text-tertiary">rank</span>
			<span className="w-16 font-mono text-xs text-text-tertiary">score</span>
			<span className="flex-1 font-mono text-xs text-text-tertiary">code</span>
			<span className="w-24 font-mono text-xs text-text-tertiary">lang</span>
		</div>
	);
};

const LeaderboardTableRow = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"flex items-center border-b border-border-primary px-5 py-3 last:border-b-0",
				className,
			)}
		>
			{children}
		</div>
	);
};

const LeaderboardTableCell = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return <span className={cn(className)}>{children}</span>;
};

const LeaderboardTableCellScore = ({
	score,
	className,
}: {
	score: number;
	className?: string;
}) => {
	return (
		<span className={cn("w-16", className)}>
			<Badge variant={getScoreVariant(score)} size="sm">
				{score}/10
			</Badge>
		</span>
	);
};

const LeaderboardTableCellCode = ({
	code,
	className,
}: {
	code: string;
	className?: string;
}) => {
	return (
		<span
			className={cn(
				"flex-1 truncate font-mono text-sm text-text-secondary",
				className,
			)}
		>
			{code}
		</span>
	);
};

const LeaderboardTableCellLanguage = ({
	language,
	className,
}: {
	language: string;
	className?: string;
}) => {
	return (
		<span className={cn("w-24", className)}>
			<Badge variant="outline" size="sm">
				{language}
			</Badge>
		</span>
	);
};

export const LeaderboardTable = Object.assign(LeaderboardTableRoot, {
	Header: LeaderboardTableHeader,
	Row: LeaderboardTableRow,
	Cell: LeaderboardTableCell,
	CellScore: LeaderboardTableCellScore,
	CellCode: LeaderboardTableCellCode,
	CellLanguage: LeaderboardTableCellLanguage,
});

export interface LeaderboardTableWithDataProps {
	entries?: LeaderboardEntry[];
	className?: string;
}

export function LeaderboardTableWithData({
	entries = MOCK_ENTRIES,
	className,
}: LeaderboardTableWithDataProps) {
	return (
		<LeaderboardTableRoot className={className}>
			<LeaderboardTableHeader />
			{entries.map((entry) => (
				<LeaderboardTableRow key={entry.rank}>
					<LeaderboardTableCell className="w-12 font-mono text-sm text-text-primary">
						#{entry.rank}
					</LeaderboardTableCell>
					<LeaderboardTableCellScore score={entry.score} />
					<LeaderboardTableCellCode code={entry.code} />
					<LeaderboardTableCellLanguage language={entry.language} />
				</LeaderboardTableRow>
			))}
		</LeaderboardTableRoot>
	);
}
