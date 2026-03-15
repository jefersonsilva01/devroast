import { Suspense } from "react";
import { CodeEditorSection } from "@/components/code-editor-section";
import { GlobalMetricsWithSuspense } from "@/components/global-metrics-with-suspense";
import { Section } from "@/components/section";
import {
	ShameLeaderboardFooter,
	ShameLeaderboardWithSuspense,
} from "@/components/shame-leaderboard";
import { ShameLeaderboardSkeleton } from "@/components/shame-leaderboard-skeleton";

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

				{/* Stats - Server Component with animation */}
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
				<Suspense
					fallback={
						<Section.Content>
							<ShameLeaderboardSkeleton />
						</Section.Content>
					}
				>
					<HomePageWithData />
				</Suspense>
			</Section>

			{/* Bottom Spacer */}
			<div className="h-16" />
		</main>
	);
}

async function HomePageWithData() {
	const caller = (await import("@/server/routers/_app")).createCaller({});
	const { totalSubmissions } = await caller.getGlobalMetrics();

	return (
		<>
			<Section.Content>
				<ShameLeaderboardWithSuspense totalSubmissions={totalSubmissions} />
			</Section.Content>
			<ShameLeaderboardFooter totalSubmissions={totalSubmissions} />
		</>
	);
}
