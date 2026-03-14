import {
	boolean,
	jsonb,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const roastModeEnum = pgEnum("roast_mode", ["honest", "sarcastic"]);

export const sessions = pgTable("sessions", {
	id: uuid("id").defaultRandom().primaryKey(),
	sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
	totalSubmissions: numeric("total_submissions", { precision: 10, scale: 0 })
		.notNull()
		.default("0"),
	averageScore: numeric("average_score", { precision: 3, scale: 1 })
		.notNull()
		.default("0"),
	bestScore: numeric("best_score", { precision: 3, scale: 1 })
		.notNull()
		.default("10"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(),
});

export const submissions = pgTable("submissions", {
	id: uuid("id").defaultRandom().primaryKey(),
	code: text("code").notNull(),
	language: varchar("language", { length: 50 }).notNull(),
	roastMode: boolean("roast_mode").notNull().default(false),
	score: numeric("score", { precision: 3, scale: 1 }).notNull(),
	roastMessage: text("roast_message").notNull(),
	issues: jsonb("issues").default("[]"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
		.notNull()
		.defaultNow(),
	sessionToken: varchar("session_token", { length: 255 }).notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
