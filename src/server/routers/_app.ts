import { initTRPC } from "@trpc/server";
import { getGlobalStats } from "@/db/queries";
import { createContext } from "../context";

const t = initTRPC.create();

export const appRouter = t.router({
	getGlobalMetrics: t.procedure.query(async () => {
		const stats = await getGlobalStats();
		return {
			totalSubmissions: stats.totalSubmissions,
			averageScore: stats.averageScore,
		};
	}),
});

export type AppRouter = typeof appRouter;

export const createCaller = t.createCallerFactory(appRouter);
