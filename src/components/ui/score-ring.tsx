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
	if (score < 3.5) return "accent-red";
	if (score < 6) return "accent-amber";
	return "accent-green";
}

export function ScoreRing({ score, maxScore = 10, className }: ScoreRingProps) {
	const clampedScore = Math.min(Math.max(score, 0), maxScore);
	const displayScore = clampedScore.toFixed(1);
	const color = getGradientColor(clampedScore);

	return (
		<div
			className={cn(
				"relative flex h-[180px] w-[180px] items-center justify-center",
				className,
			)}
		>
			{/* Outer ring */}
			<div className="absolute inset-0 rounded-full border-4 border-border-primary" />

			{/* Inner ring with gradient */}
			<div
				className="absolute inset-0 rounded-full border-4 border-transparent"
				style={{
					background: `conic-gradient(var(--color-${color}) ${(clampedScore / maxScore) * 360}deg, transparent 0deg)`,
					WebkitMask:
						"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
					WebkitMaskComposite: "xor",
					maskComposite: "exclude",
				}}
			/>

			{/* Score text */}
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
