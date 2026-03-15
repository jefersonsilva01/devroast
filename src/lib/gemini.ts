import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
	throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

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
	const systemInstruction = roastMode
		? SARCASTIC_SYSTEM_PROMPT
		: HONEST_SYSTEM_PROMPT;

	const userPrompt = `Analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nReturn JSON with: score (0-10), verdict (short phrase), roastTitle (catchy title), issues (array with severity, title, description), suggestedFix (removed and added lines).`;

	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: userPrompt,
		config: {
			systemInstruction,
			responseMimeType: "application/json",
			responseSchema: RESPONSE_SCHEMA,
		},
	});

	const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

	if (!responseText) {
		throw new Error("No response from Gemini");
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
