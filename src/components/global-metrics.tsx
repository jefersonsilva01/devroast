"use client";

import { useEffect, useState } from "react";

interface AnimatedNumberProps {
	value: number;
	format?: Intl.NumberFormatOptions;
}

function AnimatedNumber({ value, format }: AnimatedNumberProps) {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		setDisplayValue(value);
	}, [value]);

	const formatted = new Intl.NumberFormat("en-US", format).format(displayValue);

	return <span>{formatted}</span>;
}

interface GlobalMetricsProps {
	totalSubmissions: number;
	averageScore: string;
}

export function GlobalMetrics({
	totalSubmissions,
	averageScore,
}: GlobalMetricsProps) {
	return (
		<div className="flex justify-center gap-6 py-4">
			<span className="font-mono text-xs text-text-tertiary">
				<AnimatedNumber
					value={totalSubmissions}
					format={{ notation: "compact" }}
				/>{" "}
				codes roasted
			</span>
			<span className="font-mono text-xs text-text-tertiary">·</span>
			<span className="font-mono text-xs text-text-tertiary">
				avg score: <AnimatedNumber value={Number(averageScore)} /> /10
			</span>
		</div>
	);
}
