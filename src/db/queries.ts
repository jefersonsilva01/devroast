import { asc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import {
	type NewSession,
	type NewSubmission,
	sessions,
	submissions,
} from "./schema";

export async function createSubmission(data: NewSubmission) {
	const result = await db.insert(submissions).values(data).returning();
	return result[0];
}

export async function getLeaderboard(limit = 10, offset = 0) {
	return db
		.select()
		.from(submissions)
		.orderBy(asc(submissions.score))
		.limit(limit)
		.offset(offset);
}

export async function getSubmissionById(id: string) {
	const result = await db
		.select()
		.from(submissions)
		.where(eq(submissions.id, id))
		.limit(1);
	return result[0] || null;
}

export async function getSubmission(id: string) {
	const result = await db
		.select()
		.from(submissions)
		.where(eq(submissions.id, id))
		.limit(1);
	return result[0] || null;
}

export async function getSessionByToken(token: string) {
	const result = await db
		.select()
		.from(sessions)
		.where(eq(sessions.sessionToken, token))
		.limit(1);
	return result[0] || null;
}

export async function createSession(data: NewSession) {
	const result = await db.insert(sessions).values(data).returning();
	return result[0];
}

export async function getOrCreateSession(token: string) {
	const existing = await getSessionByToken(token);
	if (existing) return existing;

	return createSession({
		sessionToken: token,
		totalSubmissions: "0",
		averageScore: "0",
		bestScore: "10",
	});
}

export async function updateSessionStats(token: string) {
	const stats = await db
		.select({
			total: sql<number>`count(*)`,
			avg: sql<string>`avg(${submissions.score})`,
			best: sql<string>`min(${submissions.score})`,
		})
		.from(submissions)
		.where(eq(submissions.sessionToken, token));

	if (stats[0] && stats[0].total > 0) {
		await db
			.update(sessions)
			.set({
				totalSubmissions: String(stats[0].total),
				averageScore: stats[0].avg || "0",
				bestScore: stats[0].best || "10",
				updatedAt: new Date(),
			})
			.where(eq(sessions.sessionToken, token));
	}
}

export async function getGlobalStats() {
	const result = await db
		.select({
			total: sql<number>`count(*)`,
			avgScore: sql<string>`coalesce(avg(${submissions.score}), 0)`,
		})
		.from(submissions);

	return {
		totalSubmissions: result[0]?.total || 0,
		averageScore: result[0]?.avgScore || "0",
	};
}
