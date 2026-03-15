import { createCaller } from "@/server/routers/_app";
import { GlobalMetrics } from "./global-metrics";

export async function GlobalMetricsWithSuspense() {
	const caller = createCaller({});
	const data = await caller.getGlobalMetrics();

	return (
		<GlobalMetrics
			totalSubmissions={data.totalSubmissions}
			averageScore={data.averageScore}
		/>
	);
}
