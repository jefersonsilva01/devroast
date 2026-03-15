export function LeaderboardPageSkeleton() {
	return (
		<div className="flex flex-col gap-5">
			{[...Array(20)].map((_, i) => (
				<div
					key={`skeleton-${i}`}
					className="flex flex-col rounded-md border border-border-primary bg-bg-page"
				>
					<div className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-5">
						<div className="flex items-center gap-2">
							<span className="font-mono text-sm text-text-tertiary">#</span>
							<span className="h-4 w-6 animate-pulse rounded bg-text-tertiary/20" />
						</div>
						<div className="flex items-center gap-2">
							<span className="font-mono text-xs text-text-tertiary">
								score:
							</span>
							<span className="h-4 w-8 animate-pulse rounded bg-text-tertiary/20" />
						</div>
						<div className="flex items-center gap-3">
							<span className="h-4 w-16 animate-pulse rounded bg-text-tertiary/20" />
							<span className="h-4 w-10 animate-pulse rounded bg-text-tertiary/20" />
						</div>
					</div>
					<div className="flex min-h-[120px] items-center px-5 py-4">
						<div className="flex flex-col gap-2">
							{[1, 2].map((j) => (
								<span
									key={j}
									className="h-4 w-full animate-pulse rounded bg-text-tertiary/10"
								/>
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
