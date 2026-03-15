import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { getGlobalStats, getLeaderboard } from "@/db/queries";

const t = initTRPC.create();

export const appRouter = t.router({
	getGlobalMetrics: t.procedure.query(async () => {
		const stats = await getGlobalStats();
		return {
			totalSubmissions: stats.totalSubmissions,
			averageScore: stats.averageScore,
		};
	}),
	getShameLeaderboard: t.procedure
		.input(z.object({ limit: z.number().default(3) }))
		.query(async ({ input }) => {
			const entries = await getLeaderboard(input.limit, 0);
			return entries.map((e, i) => ({
				rank: i + 1,
				id: String(e.id),
				score: Number(e.score),
				code: e.code,
				language: e.language,
				lines: e.code.split("\n").length,
			}));
		}),
	getLeaderboard: t.procedure
		.input(
			z.object({
				limit: z.number().min(1).max(20).default(20),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ input }) => {
			const entries = await getLeaderboard(input.limit, input.offset);
			return entries.map((e, i) => ({
				rank: input.offset + i + 1,
				id: String(e.id),
				score: Number(e.score),
				code: e.code,
				language: e.language,
				lines: e.code.split("\n").length,
			}));
		}),
});

export type AppRouter = typeof appRouter;

export const createCaller = t.createCallerFactory(appRouter);
