import Link from "next/link";
import { CodeEditorSection } from "@/components/code-editor-section";
import { GlobalMetricsWithSuspense } from "@/components/global-metrics-with-suspense";
import { LeaderboardTableWithData } from "@/components/leaderboard-table";
import { Section } from "@/components/section";

export default function HomePage() {
	return (
		<main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 py-8">
			{/* Hero Section */}
			<div className="flex w-full max-w-3xl flex-col gap-3">
				{/* Title */}
				<div className="flex items-center gap-3">
					<span className="font-mono text-[36px] font-bold text-accent-green">
						$
					</span>
					<span className="font-mono text-[36px] font-bold text-text-primary">
						paste your code. get roasted.
					</span>
				</div>

				{/* Subtitle */}
				<p className="font-mono text-sm text-text-secondary">
					{"//"} drop your code below and we&apos;ll rate it — brutally honest
					or full roast mode
				</p>

				{/* Code Editor Section */}
				<CodeEditorSection />

				{/* Stats - Server Component with Suspense */}
				<GlobalMetricsWithSuspense />
			</div>

			{/* Spacer */}
			<div className="h-16" />

			{/* Leaderboard Preview */}
			<Section>
				<Section.Title prefix="//">shame_leaderboard</Section.Title>
				<Section.Description>
					{"//"} the worst code on the internet, ranked by shame
				</Section.Description>
				<Section.Content>
					<div className="overflow-hidden rounded-md border border-border-primary">
						<LeaderboardTableWithData />
					</div>
				</Section.Content>
				<Link
					href="/leaderboard"
					className="px-4 py-3 text-center font-mono text-xs text-text-tertiary hover:text-text-secondary"
				>
					showing top 3 of 2,847 · view full leaderboard &gt;&gt;
				</Link>
			</Section>

			{/* Bottom Spacer */}
			<div className="h-16" />
		</main>
	);
}
