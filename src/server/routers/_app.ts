import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
	createSubmission,
	getGlobalStats,
	getLeaderboard,
	getSubmissionById,
} from "@/db/queries";
import type { RoastAnalysis } from "@/lib/gemini";
import { analyzeCode } from "@/lib/gemini";

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
	createRoast: t.procedure
		.input(
			z.object({
				code: z.string().min(1).max(5000),
				language: z.string(),
				roastMode: z.boolean().default(false),
			}),
		)
		.mutation(async ({ input }) => {
			const analysis = await analyzeCode(
				input.code,
				input.language,
				input.roastMode,
			);

			const submission = await createSubmission({
				code: input.code,
				language: input.language,
				roastMode: input.roastMode,
				score: String(analysis.score),
				roastMessage: analysis.roastTitle,
				issues: analysis.issues,
				sessionToken: "anonymous",
			});

			return { id: String(submission.id) };
		}),
	getSubmission: t.procedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => {
			const submission = await getSubmissionById(input.id);
			if (!submission) {
				throw new Error("Submission not found");
			}
			const issues = submission.issues as RoastAnalysis["issues"];
			return {
				id: String(submission.id),
				code: submission.code,
				language: submission.language,
				roastMode: submission.roastMode,
				score: Number(submission.score),
				roastMessage: submission.roastMessage,
				issues,
				suggestedFix: {
					removed: [],
					added: [],
				},
				createdAt: submission.createdAt,
				verdict: submission.roastMessage,
			};
		}),
});

export type AppRouter = typeof appRouter;

export const createCaller = t.createCallerFactory(appRouter);
