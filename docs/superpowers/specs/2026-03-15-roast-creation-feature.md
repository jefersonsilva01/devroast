# Roast Creation Feature Specification

## Overview

Enable users to submit code snippets for AI-powered analysis using Google Gemini 2.0 Flash, with two modes: honest (constructive) and sarcastic (roast style).

## Flow

```
Home Page → Submit Code → tRPC Mutation → Gemini API → Save to DB → Redirect /results/[id]
```

## API

### tRPC Procedure: `createRoast`

**Input:**
```typescript
{
  code: string;        // 1-5000 chars
  language: string;    // e.g., "javascript", "python"
  roastMode: boolean;  // false = honest, true = sarcastic
}
```

**Output:**
```typescript
{
  id: string;  // UUID for redirect
}
```

### tRPC Procedure: `getSubmission`

**Input:**
```typescript
{ id: string }
```

**Output:**
```typescript
{
  id: string;
  code: string;
  language: string;
  roastMode: boolean;
  score: number;        // 0-10
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

## Gemini Integration

**Model:** `gemini-2.0-flash` (free tier)

**Function:** `analyzeCode(code, language, roastMode)` in `src/lib/gemini.ts`

### Prompt Variants

**Honest Mode:**
- Objective technical analysis
- Constructive criticism
- Focus on best practices

**Sarcastic Mode:**
- Humoristic tone
- Irony and roast-style comments
- Same technical accuracy but delivery differs

### Response Schema (JSON)

```json
{
  "score": 7.5,
  "verdict": "needs_work",
  "roastTitle": "string",
  "issues": [
    {
      "severity": "critical|warning|good",
      "title": "string",
      "description": "string"
    }
  ],
  "suggestedFix": {
    "removed": ["line1", "line2"],
    "added": ["line1"]
  }
}
```

## Database

**Table:** `submissions` (already exists)

**Fields used:**
- `id` (UUID)
- `code` (text)
- `language` (varchar)
- `roastMode` (boolean)
- `score` (numeric)
- `roastMessage` (text)
- `issues` (jsonb)
- `createdAt` (timestamp)
- `sessionToken` (varchar)

## Frontend

### CodeEditorSection Changes

- Add `onSubmit` handler to button
- Call `createRoast` mutation via tRPC client hook
- On success: `router.push(\`/results/\${result.id}\`)`
- Handle loading state (disable button, show spinner)
- Handle error state (show toast/message)

### Results Page (`/results/[id]`)

- Fetch submission via `getSubmission` tRPC query
- Use existing UI components (CodeBlock, ScoreRing, IssueCard, DiffPreview)
- Apply `"use cache"` with 1h revalidation for the query
- Display: score, verdict, roast title, code with line numbers, issues, suggested fix

## Not in Scope

- Share functionality
- User authentication/sessions (future)
- Code execution/sandbox

## Acceptance Criteria

1. User can submit code with language selection
2. User can toggle roast mode (honest/sarcastic)
3. Submit button triggers API call and shows loading state
4. On success, redirects to /results/[id] with real data
5. Results page displays: score ring, verdict, code with syntax highlighting, issues list, suggested fix diff
6. Gemini API returns structured response matching schema
7. Data is persisted to database
8. Cache revalidation set to 1 hour on results page
