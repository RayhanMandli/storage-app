import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});


function cleanTag(tag = "") {
    return String(tag || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normalizeSummary(summary = "") {
    const lines = String(summary || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => (line.startsWith("-") ? line : `- ${line}`))
        .slice(0, 5);

    return lines.join("\n");
}

function parseJsonFromText(text = "") {
    const jsonMatch = String(text).match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    try {
        return JSON.parse(jsonMatch[0]);
    } catch {
        return null;
    }
}


export async function generateSummaryAndTags(text = "") {
    const prompt = `
Return STRICT JSON only.

Format:
{"summary":["point 1","point 2"],"tags":["tag1","tag2"]}

Rules:
- Summary must have 3 to 5 concise, general-purpose bullet points
- Tags must have 3 to 5 lowercase, relevant keywords
- Do NOT include personally identifiable or sensitive information (names, emails, phone numbers, IDs)
- Focus on concepts, topics, and key ideas only
- Avoid repeating the same idea
- No markdown, no explanations, only JSON
- Tags should be 1–3 words max and hyphen-separated

Content:
${text.slice(0, 3000)}
`;

    const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });
    const textOutput = result.text;


    const parsed = parseJsonFromText(textOutput);

    if (!parsed) {
        throw new Error("Gemini response could not be parsed");
    }

    return {
        summary: normalizeSummary(parsed.summary.join("\n")),
        tags: parsed.tags.map(cleanTag),
    };
}
