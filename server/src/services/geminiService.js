import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import apiError from "../utils/apiError.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeResume = async (filePath, mimeType) => {
  try {
    const file = fs.readFileSync(filePath);

    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze this resume like ResumeWorded and CVScoring.

Return ONLY valid JSON.

Never use markdown.

Never wrap response inside \`\`\`.

Return exactly this JSON:

{
  "atsScore": 0,
  "overallVerdict": "",

  "summary": "",

  "sectionScores": {
    "contactInfo":0,
    "experience":0,
    "skills":0,
    "education":0,
    "projects":0,
    "keywords":0,
    "formatting":0
  },

  "strengths": [],

  "weaknesses": [],

  "missingSkills": [],

  "suggestions": [],

  "interviewQuestions": []
}

Rules:

ATS Score must be 0-100.

overallVerdict should be one of:

Excellent

Good

Average

Poor

Summary should contain 4-5 lines.

Generate minimum

5 strengths

5 weaknesses

8 missing skills

8 suggestions

10 interview questions

Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          inlineData: {
            mimeType,
            data: file.toString("base64"),
          },
        },
        {
          text: prompt,
        },
      ],
    });

    console.log("response", response.text);
    let text = response.text.trim();

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    return JSON.parse(text);
  } catch (error) {
    console.error(error);

    throw new apiError("Failed to analyze resume.", 500);
  }
};
