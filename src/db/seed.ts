import "dotenv/config";
import { faker } from "@faker-js/faker";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

const LANGUAGES = [
	"javascript",
	"typescript",
	"python",
	"go",
	"rust",
	"java",
	"csharp",
	"cpp",
	"ruby",
	"php",
	"swift",
	"kotlin",
];

const ROAST_MESSAGES = {
	honest: [
		"This code has no error handling. Add try-catch blocks.",
		"Variables are not typed. Consider adding TypeScript.",
		"This function is too long. Break it into smaller pieces.",
		"No comments explaining the logic. Add documentation.",
		"Magic numbers used. Define constants instead.",
		"Nested callbacks detected. Consider using async/await.",
		"No input validation. Sanitize user inputs.",
		"This is O(n²). Consider using a hash map.",
		"No unit tests. Add test coverage.",
		"Duplicate code found. Extract to reusable function.",
	],
	sarcastic: [
		"Wow, this is so clean it hurts my eyes. NOT!",
		"Did you write this at 3am? Because it shows.",
		"This code is a crime against humanity.",
		"I've seen better logic in a fortune cookie.",
		"Sir, this is a Wendy's. And so is this code.",
		"This is why we can't have nice things.",
		"Congratulations, you invented technical debt!",
		"This deserves its own museum exhibit: 'Code As Art'",
		"The indentation is giving me schizophrenia.",
		"My cat walked on the keyboard and wrote better code.",
	],
};

function generateCodeSnippet(language: string): string {
	const snippets: Record<string, string[]> = {
		javascript: [
			"function foo() { return 1; }",
			"const x = 1; x = 2;",
			"if (true) { return false; }",
			"for (let i = 0; i < 10; i++) { console.log(i); }",
			"try {} catch (e) {}",
			"arr.map(x => x * 2).filter(x => x > 5);",
			"let result = data?.items?.[0]?.value ?? null;",
			"setTimeout(() => {}, 1000);",
		],
		typescript: [
			"const x: number = 'hello';",
			"interface Foo { name: string }",
			"type T = string | number;",
			"function fn(a: any): any { return a; }",
			"class A { private x: number = '1'; }",
		],
		python: [
			"def foo():\n    return 1",
			"x = 1\nx = 2",
			"if True:\n    return False",
			"for i in range(10):\n    print(i)",
			"try:\n    pass\nexcept:\n    pass",
			"[x*2 for x in range(10)]",
		],
		go: [
			"func foo() int { return 1 }",
			"var x int = 1",
			"if true { return false }",
			"for i := 0; i < 10; i++ {}",
			"err := nil",
		],
		rust: [
			"fn foo() -> i32 { 1 }",
			"let mut x = 1;",
			"if true { return false; }",
			"for i in 0..10 {}",
			"unwrap() everywhere",
		],
		java: [
			"public int foo() { return 1; }",
			"int x = 1;",
			"if (true) { return false; }",
			"for (int i = 0; i < 10; i++) {}",
			"try {} catch (Exception e) {}",
		],
		csharp: [
			"public int Foo() { return 1; }",
			"int x = 1;",
			"if (true) { return false; }",
			"for (int i = 0; i < 10; i++) {}",
			"var x = new object();",
		],
		cpp: [
			"int foo() { return 1; }",
			"int x = 1;",
			"if (true) { return false; }",
			"for (int i = 0; i < 10; i++) {}",
			"int* p = nullptr;",
		],
		ruby: [
			"def foo\n  1\nend",
			"x = 1",
			"if true\n  false\nend",
			"10.times do |i|\nend",
			"begin; rescue; end",
		],
		php: [
			"function foo() { return 1; }",
			"$x = 1;",
			"if (true) { return false; }",
			"for ($i = 0; $i < 10; $i++) {}",
			"try {} catch (Exception $e) {}",
		],
		swift: [
			"func foo() -> Int { 1 }",
			"var x = 1",
			"if true { return false }",
			"for i in 0..<10 {}",
			"let x: Int = 1",
		],
		kotlin: [
			"fun foo(): Int = 1",
			"var x = 1",
			"if (true) return false",
			"for (i in 0..10) {}",
			"val x: Int = 1",
		],
	};

	const langSnippets = snippets[language] || snippets.javascript;
	return faker.helpers.arrayElement(langSnippets);
}

function generateSessionToken(): string {
	return faker.string.alphanumeric(32);
}

function randomDate(): Date {
	const now = new Date();
	const past = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
	return faker.date.between({ from: past, to: now });
}

async function seed() {
	console.log("🌱 Starting seed...\n");

	const sessions: Array<{
		id: string;
		session_token: string;
		total_submissions: string;
		average_score: string;
		best_score: string;
		created_at: Date;
		updated_at: Date;
	}> = [];

	const submissions: Array<{
		id: string;
		code: string;
		language: string;
		roast_mode: boolean;
		score: string;
		roast_message: string;
		issues: string;
		created_at: Date;
		session_token: string;
	}> = [];

	const uniqueTokens = new Set<string>();
	while (uniqueTokens.size < 30) {
		uniqueTokens.add(generateSessionToken());
	}
	const tokens = Array.from(uniqueTokens);

	console.log("Creating sessions...");
	for (const token of tokens) {
		const totalSubmissions = faker.number.int({ min: 1, max: 10 });
		const scores: number[] = [];
		for (let i = 0; i < totalSubmissions; i++) {
			scores.push(
				parseFloat(
					faker.number.float({ fractionDigits: 1, min: 0, max: 10 }).toFixed(1),
				),
			);
		}
		const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
		const best = Math.min(...scores);

		sessions.push({
			id: faker.string.uuid(),
			session_token: token,
			total_submissions: String(totalSubmissions),
			average_score: avg.toFixed(1),
			best_score: best.toFixed(1),
			created_at: randomDate(),
			updated_at: randomDate(),
		});
	}

	console.log(`Created ${sessions.length} sessions`);

	console.log("Creating submissions (100 roasts)...");
	for (let i = 0; i < 100; i++) {
		const language = faker.helpers.arrayElement(LANGUAGES);
		const roastMode = faker.datatype.boolean();
		const isHonest = !roastMode;
		const messagePool = isHonest
			? ROAST_MESSAGES.honest
			: ROAST_MESSAGES.sarcastic;
		const score = parseFloat(
			faker.number.float({ fractionDigits: 1, min: 0, max: 10 }).toFixed(1),
		);

		submissions.push({
			id: faker.string.uuid(),
			code: generateCodeSnippet(language),
			language,
			roast_mode: roastMode,
			score: score.toFixed(1),
			roast_message: faker.helpers.arrayElement(messagePool),
			issues: JSON.stringify([
				{
					line: faker.number.int({ min: 1, max: 20 }),
					severity: faker.helpers.arrayElement(["error", "warning", "info"]),
					message: faker.lorem.sentence(),
				},
			]),
			created_at: randomDate(),
			session_token: faker.helpers.arrayElement(tokens),
		});
	}

	console.log(`Created ${submissions.length} submissions`);

	console.log("\nInserting into database...");

	for (const session of sessions) {
		await client`
      INSERT INTO sessions (id, session_token, total_submissions, average_score, best_score, created_at, updated_at)
      VALUES (${session.id}, ${session.session_token}, ${session.total_submissions}, ${session.average_score}, ${session.best_score}, ${session.created_at}, ${session.updated_at})
    `;
	}

	for (const sub of submissions) {
		await client`
      INSERT INTO submissions (id, code, language, roast_mode, score, roast_message, issues, created_at, session_token)
      VALUES (${sub.id}, ${sub.code}, ${sub.language}, ${sub.roast_mode}, ${sub.score}, ${sub.roast_message}, ${sub.issues}::jsonb, ${sub.created_at}, ${sub.session_token})
    `;
	}

	console.log("\n✅ Seed completed!");
	console.log(`   - ${sessions.length} sessions`);
	console.log(`   - ${submissions.length} submissions`);

	await client.end();
}

seed().catch(console.error);
