import OpenAI from "openai";

const OPENAI_API_KEY = process.env.GPT_API_KEY;

if (!OPENAI_API_KEY) {
	throw new Error("GPT_API_KEY is not set");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

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

export async function analyzeCode(
	code: string,
	language: string,
	roastMode: boolean,
): Promise<RoastAnalysis> {
	const systemInstruction = roastMode
		? SARCASTIC_SYSTEM_PROMPT
		: HONEST_SYSTEM_PROMPT;

	const userPrompt = `Analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn JSON with: score (0-10), verdict (short phrase), roastTitle (catchy title), issues (array with severity, title, description), suggestedFix (removed and added lines).`;

	const response = await openai.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{ role: "system", content: systemInstruction },
			{ role: "user", content: userPrompt },
		],
		response_format: { type: "json_object" },
	});

	const responseText = response.choices[0]?.message?.content;

	if (!responseText) {
		throw new Error("No response from OpenAI");
	}

	const parsed = JSON.parse(responseText);

	return {
		score: parsed.score,
		verdict: parsed.verdict,
		roastTitle: parsed.roastTitle,
		issues: parsed.issues,
		suggestedFix: parsed.suggestedFix,
	};
}
