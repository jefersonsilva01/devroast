# Roast Creation Feature Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable users to submit code for AI-powered roast analysis using Gemini 2.0 Flash, with two modes (honest/sarcastic), and display results on a dedicated page.

**Architecture:** 
- tRPC mutation `createRoast` calls Gemini API and saves to database
- tRPC query `getSubmission` fetches saved submission for results page
- Frontend uses tRPC client hooks for mutation and redirect

**Tech Stack:** Next.js 16, tRPC v11, Drizzle ORM, Gemini 2.0 Flash API

---

## Chunk 1: Backend - Gemini Integration & Database Queries

### Task 1: Install Gemini SDK

**Files:**
- Modify: `package.json`
- Test: N/A

- [ ] **Step 1: Add @google/generativeai dependency**

Run: `npm install @google/generativeai`

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @google/generativeai dependency"
```

---

### Task 2: Create Gemini Service

**Files:**
- Create: `src/lib/gemini.ts`

- [ ] **Step 1: Write Gemini service**

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface RoastAnalysis {
	score: number;
	verdict: string;
	roastTitle: string;
	issues: {
		severity: "critical" | "warning" | "good";
		title: string;
		description: string;
	}[];
	suggestedFix: {
		removed: string[];
		added: string[];
	};
}

const HONEST_SYSTEM_PROMPT = `You are a helpful code reviewer. Analyze the provided code and give constructive, objective feedback. Rate the code from 0-10 based on quality, best practices, and potential bugs. Return JSON only.`;

const SARCASTIC_SYSTEM_PROMPT = `You are a brutal but witty code reviewer. Roast the provided code with sarcasm and humor while still providing accurate technical feedback. Be mean but fair. Rate the code from 0-10 based on quality, best practices, and potential bugs. Return JSON only.`;

const RESPONSE_SCHEMA = {
	type: "object",
	properties: {
		score: { type: "number" },
		verdict: { type: "string" },
		roastTitle: { type: "string" },
		issues: {
			type: "array",
			items: {
				type: "object",
				properties: {
					severity: { type: "string", enum: ["critical", "warning", "good"] },
					title: { type: "string" },
					description: { type: "string" },
				},
				required: ["severity", "title", "description"],
			},
		},
		suggestedFix: {
			type: "object",
			properties: {
				removed: { type: "array", items: { type: "string" } },
				added: { type: "array", items: { type: "string" } },
			},
			required: ["removed", "added"],
		},
	},
	required: ["score", "verdict", "roastTitle", "issues", "suggestedFix"],
};

export async function analyzeCode(
	code: string,
	language: string,
	roastMode: boolean,
): Promise<RoastAnalysis> {
	const model = genAI.getGenerativeModel({
		model: "gemini-2.0-flash",
		systemInstruction: roastMode ? SARCASTIC_SYSTEM_PROMPT : HONEST_SYSTEM_PROMPT,
	});

	const userPrompt = `Analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn JSON with: score (0-10), verdict (short phrase), roastTitle (catchy title), issues (array with severity, title, description), suggestedFix (removed and added lines).`;

	const result = await model.generateContent({
		contents: [{ role: "user", parts: [{ text: userPrompt }] }],
		generationConfig: {
			responseMimeType: "application/json",
			responseSchema: RESPONSE_SCHEMA,
		},
	});

	const responseText = result.response.text();
	const parsed = JSON.parse(responseText);

	return {
		score: parsed.score,
		verdict: parsed.verdict,
		roastTitle: parsed.roastTitle,
		issues: parsed.issues,
		suggestedFix: parsed.suggestedFix,
	};
}
```

- [ ] **Step 2: Add GEMINI_API_KEY to .env.example**

Add: `GEMINI_API_KEY=your_api_key_here`

- [ ] **Step 3: Commit**

```bash
git add src/lib/gemini.ts .env.example
git commit -m "feat: add Gemini service for code analysis"
```

---

### Task 3: Add getSubmission Query

**Files:**
- Modify: `src/db/queries.ts`

- [ ] **Step 1: Add getSubmission function**

```typescript
export async function getSubmission(id: string) {
	const result = await db
		.select()
		.from(submissions)
		.where(eq(submissions.id, id))
		.limit(1);
	return result[0] || null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/db/queries.ts
git commit -m "feat: add getSubmission query"
```

---

## Chunk 2: Backend - tRPC Procedures

### Task 4: Add tRPC Procedures

**Files:**
- Modify: `src/server/routers/_app.ts`

- [ ] **Step 1: Add imports**

```typescript
import { createSubmission, getSubmission } from "@/db/queries";
import { analyzeCode } from "@/lib/gemini";
```

- [ ] **Step 2: Add createRoast mutation**

```typescript
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
			sessionToken: "anonymous", // TODO: implement sessions
		});

		return { id: String(submission.id) };
	}),
```

- [ ] **Step 3: Add getSubmission query**

```typescript
getSubmission: t.procedure
	.input(z.object({ id: z.string() }))
	.query(async ({ input }) => {
		const submission = await getSubmission(input.id);
		if (!submission) {
			throw new Error("Submission not found");
		}
		return {
			id: String(submission.id),
			code: submission.code,
			language: submission.language,
			roastMode: submission.roastMode,
			score: Number(submission.score),
			roastMessage: submission.roastMessage,
			issues: submission.issues as RoastAnalysis["issues"],
			suggestedFix: (submission.issues as RoastAnalysis["issues"])[0]?.description
				? { removed: [], added: [] }
				: { removed: [], added: [] },
			createdAt: submission.createdAt,
			verdict: submission.roastMessage,
		};
	}),
```

Note: You'll need to add the `RoastAnalysis` type import from `@/lib/gemini`.

- [ ] **Step 4: Commit**

```bash
git add src/server/routers/_app.ts
git commit -m "feat: add createRoast and getSubmission tRPC procedures"
```

---

## Chunk 3: Frontend - Client Mutation

### Task 5: Setup tRPC Client Hooks

**Files:**
- Modify: `src/lib/trpc/client-provider.tsx`

- [ ] **Step 1: Check existing client provider setup**

Read `src/lib/trpc/client-provider.tsx` to see if mutation hooks are already configured.

- [ ] **Step 2: If needed, add mutation hooks**

The existing setup likely already has hooks. Skip if `useMutation` is available.

- [ ] **Step 3: Commit (if changes made)**

```bash
git add src/lib/trpc/client-provider.tsx
git commit -m "feat: setup tRPC mutation hooks"
```

---

### Task 6: Update CodeEditorSection

**Files:**
- Modify: `src/components/code-editor-section.tsx`

- [ ] **Step 1: Add imports**

```typescript
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
```

- [ ] **Step 2: Add mutation and router**

```typescript
export function CodeEditorSection() {
	const router = useRouter();
	const [code, setCode] = useState(MOCK_CODE);
	const [roastMode, setRoastMode] = useState(false);
	const [language, setLanguage] = useState("javascript");
	const MAX_LENGTH = 5000;
	const isOverLimit = code.length > MAX_LENGTH;

	const createRoast = trpc.createRoast.useMutation({
		onSuccess: (data) => {
			router.push(`/results/${data.id}`);
		},
		onError: (error) => {
			alert(`Error: ${error.message}`);
		},
	});

	const handleSubmit = () => {
		createRoast.mutate({ code, language, roastMode });
	};
```

- [ ] **Step 3: Update button**

```typescript
<Button 
	onClick={handleSubmit} 
	disabled={isOverLimit || createRoast.isPending}
>
	{createRoast.isPending ? "roasting..." : "$ roast_my_code"}
</Button>
```

- [ ] **Step 4: Add language selector to the component**

Use the existing `LanguageSelector` component if available, or add a simple select.

- [ ] **Step 5: Commit**

```bash
git add src/components/code-editor-section.tsx
git commit -m "feat: add createRoast mutation to CodeEditorSection"
```

---

## Chunk 4: Frontend - Results Page

### Task 7: Update Results Page

**Files:**
- Modify: `src/app/results/[id]/page.tsx` (note: spec says `/results/[id]` but existing is `/result/[id]`)

**Important:** Check if the route is `/results` or `/result` - update accordingly.

- [ ] **Step 1: Add imports and update page**

```typescript
import { createCaller } from "@/server/routers/_app";
import { getSubmission } from "@/db/queries";
import { cacheLife } from "next/cache";

// Add this for proper typing
interface RoastResult {
	id: string;
	code: string;
	language: string;
	roastMode: boolean;
	score: number;
	roastMessage: string;
	verdict: string;
	issues: {
		severity: "critical" | "warning" | "good";
		title: string;
		description: string;
	}[];
	suggestedFix: {
		removed: string[];
		added: string[];
	};
	createdAt: Date;
}
```

- [ ] **Step 2: Update page component**

Replace the MOCK_RESULT with real data fetching:

```typescript
export default async function ResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	"use cache";
	cacheLife({ revalidate: 3600 });
	
	const { id } = await params;
	const caller = createCaller({});
	const result = await caller.getSubmission({ id });

	// Transform to match component expectations
	const submission = {
		score: result.score,
		verdict: result.verdict,
		roastTitle: result.roastMessage,
		language: result.language,
		lines: result.code.split("\n").length,
		code: result.code,
		issues: result.issues,
		suggestedFix: result.suggestedFix,
	};

	return (
		// ... existing JSX, replacing MOCK_RESULT with submission
	);
}
```

- [ ] **Step 3: Update generateMetadata**

```typescript
export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const caller = createCaller({});
	
	try {
		const result = await caller.getSubmission({ id });
		return {
			title: `Roast Result | devroast`,
			description: `Score: ${result.score}/10 - ${result.roastMessage}`,
		};
	} catch {
		return {
			title: "Roast Result | devroast",
			description: "Check out your roast result",
		};
	}
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/results/[id]/page.tsx  # or src/app/result/[id]/page.tsx
git commit -m "feat: update results page with real data"
```

---

## Chunk 5: Testing & Verification

### Task 8: Test the Flow

**Files:**
- Test: Manual testing

- [ ] **Step 1: Add GEMINI_API_KEY to .env**

```bash
cp .env.example .env
# Edit .env and add your API key
```

- [ ] **Step 2: Run dev server**

```bash
npm run dev
```

- [ ] **Step 3: Test the flow**

1. Go to homepage
2. Enter some code
3. Select language
4. Toggle roast mode (optional)
5. Click "roast_my_code"
6. Should redirect to /results/[id]
7. Should see real analysis from Gemini

- [ ] **Step 4: Verify data is saved**

Check database or verify leaderboard shows the new submission.

- [ ] **Step 5: Commit any final changes**

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Install @google/generativeai |
| 2 | Create src/lib/gemini.ts |
| 3 | Add getSubmission to queries |
| 4 | Add tRPC procedures |
| 5 | Setup tRPC client (if needed) |
| 6 | Update CodeEditorSection |
| 7 | Update results page |
| 8 | Test and verify |
