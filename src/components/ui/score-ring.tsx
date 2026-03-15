import { cn } from "@/lib/utils";

export interface ScoreRingProps {
	score: number;
	maxScore?: number;
	className?: string;
}

function getScoreColor(score: number): string {
	if (score < 3.5) return "text-accent-red";
	if (score < 6) return "text-accent-amber";
	return "text-accent-green";
}

function getGradientColor(score: number): string {
	if (score < 3.5) return "#ef4444";
	if (score < 6) return "#f59e0b";
	return "#10b981";
}

export function ScoreRing({ score, maxScore = 10, className }: ScoreRingProps) {
	const clampedScore = Math.min(Math.max(score, 0), maxScore);
	const displayScore = clampedScore.toFixed(1);
	const color = getGradientColor(clampedScore);
	const percentage = (clampedScore / maxScore) * 100;
	const circumference = 2 * Math.PI * 70;
	const dashOffset = circumference - (percentage / 100) * circumference;

	return (
		<div
			className={cn(
				"relative flex h-[180px] w-[180px] items-center justify-center",
				className,
			)}
		>
			<svg className="absolute h-full w-full -rotate-90">
				<title>
					Score: {displayScore} out of {maxScore}
				</title>
				<circle
					cx="90"
					cy="90"
					r="70"
					fill="none"
					stroke="currentColor"
					strokeWidth="8"
					className="text-border-primary"
				/>
				<circle
					cx="90"
					cy="90"
					r="70"
					fill="none"
					stroke={color}
					strokeWidth="8"
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={dashOffset}
					className="transition-all duration-500"
				/>
			</svg>

			<div className="flex flex-col items-center">
				<span
					className={cn("text-[48px] font-bold", getScoreColor(clampedScore))}
				>
					{displayScore}
				</span>
				<span className="text-sm text-text-tertiary">/{maxScore}</span>
			</div>
		</div>
	);
}
