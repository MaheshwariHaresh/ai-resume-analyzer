import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import apiError from "../utils/apiError.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Analyze Resume
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
    "contactInfo": 0,
    "experience": 0,
    "skills": 0,
    "education": 0,
    "projects": 0,
    "keywords": 0,
    "formatting": 0
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

Generate minimum:

5 strengths

5 weaknesses

8 missing skills

8 suggestions

10 interview questions

Return JSON only.
`;

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
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

        let text = response.text.trim();

        text = text.replace(/```json/g, "");
        text = text.replace(/```/g, "");
        text = text.trim();

        return JSON.parse(text);
      } catch (error) {
        console.error(
          `Gemini analysis attempt ${attempt}/${maxAttempts} failed:`,
          error,
        );

        const isTemporaryError =
          error?.status === 503 ||
          error?.error?.code === 503 ||
          error?.error?.status === "UNAVAILABLE";

        // Retry only temporary Gemini availability errors
        if (isTemporaryError && attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }

        throw error;
      }
    }
  } catch (error) {
    console.error("Resume analysis failed:", error);

    if (
      error?.status === 503 ||
      error?.error?.code === 503 ||
      error?.error?.status === "UNAVAILABLE"
    ) {
      throw new apiError(
        "Resume analysis service is temporarily unavailable. Please try again in a moment.",
        503,
      );
    }

    if (error instanceof SyntaxError) {
      throw new apiError(
        "The AI returned an invalid analysis response. Please try again.",
        500,
      );
    }

    throw new apiError("Failed to analyze resume.", 500);
  }
};
// Generate Interview Questions
export const generateInterviewQuestions = async (
  resume,
  interviewType = "Technical",
  difficulty = "Medium",
  questionCount = 10,
) => {
  try {
    const prompt = `
You are an expert AI interviewer.

Analyze the candidate's resume and generate interview questions specifically based on the candidate's skills, projects, experience, education, and technologies.

Interview Configuration:

Interview Type: ${interviewType}
Difficulty: ${difficulty}
Number of Questions: ${questionCount}

IMPORTANT RULES:

1. Generate EXACTLY ${questionCount} questions.
2. Every question must match the selected interview type.
3. Every question must match the selected difficulty level.
4. Questions should be based primarily on the candidate's actual resume.
5. Do not ask about technologies or experience that are completely unrelated to the resume.
6. Make questions realistic for an actual job interview.
7. Avoid duplicate or very similar questions.

Interview Type Rules:

Technical:
Focus on programming, technologies, frameworks, databases, APIs, authentication, architecture, projects, debugging, and problem solving.

HR:
Focus on introduction, career goals, strengths, weaknesses, motivation, teamwork, challenges, and career-related questions.

Behavioral:
Focus on real-world situations, teamwork, conflict resolution, problem solving, leadership, failures, and decision making.

Mixed:
Combine technical, HR, and behavioral questions.

Difficulty Rules:

Easy:
Basic concepts and straightforward questions.

Medium:
Conceptual understanding, project-based questions, and practical implementation.

Hard:
Deep technical concepts, architecture, optimization, debugging, scalability, and advanced problem solving.

Return ONLY valid JSON.

Do not return markdown.

Do not wrap the response inside \`\`\`.

Return exactly this format:

{
  "questions": [
    {
      "question": "",
      "difficulty": "${difficulty}"
    }
  ]
}

Resume Analysis:

${JSON.stringify(resume.analysis)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          text: prompt,
        },
      ],
    });

    let text = response.text.trim();

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    const result = JSON.parse(text);

    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error("Invalid questions response from Gemini.");
    }

    return result.questions;
  } catch (error) {
    console.error("Interview Question Generation Error:", error);

    throw new apiError("Failed to generate interview questions.", 500);
  }
};

// Evaluate Interview Answers
export const evaluateInterviewAnswers = async (session) => {
  try {
    const prompt = `
You are an expert technical interviewer and interview evaluator.

Evaluate the candidate's answers based on the interview questions provided.

Interview Configuration:

Interview Type: ${session.interviewType}
Difficulty: ${session.difficulty}

IMPORTANT RULES:

1. Evaluate every question and answer.
2. Give each answer a score from 0 to 10.
3. Consider:
   - Technical correctness
   - Understanding of the concept
   - Relevance to the question
   - Clarity
   - Practical knowledge
   - Use of examples where appropriate
4. Do not give a high score just because an answer is long.
5. If an answer is incorrect or irrelevant, give an appropriate low score.
6. Provide a useful and specific improvement suggestion for every answer.
7. Calculate the overall score as a percentage from 0 to 100 based on all individual scores.
8. Do not evaluate questions that were not part of this interview.
9. Return feedback for EXACTLY ${session.questions.length} questions.
10. Keep the feedback concise and useful for the candidate.

Return ONLY valid JSON.

Do not return markdown.
Do not wrap the response inside code fences.

Return exactly this format:

{
  "feedback": [
    {
      "question": "",
      "score": 0,
      "suggestion": ""
    }
  ],
  "overallScore": 0
}

Interview Questions and Candidate Answers:

${JSON.stringify(
  session.questions.map((question, index) => ({
    question: question.question,
    difficulty: question.difficulty,
    answer: session.answers[index]?.answer || "",
  })),
)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          text: prompt,
        },
      ],
    });

    let text = response.text.trim();

    // Remove accidental markdown/code fences
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    const result = JSON.parse(text);

    // Validate AI response
    if (
      !result.feedback ||
      !Array.isArray(result.feedback) ||
      typeof result.overallScore !== "number"
    ) {
      throw new Error("Invalid interview evaluation response from Gemini.");
    }

    // Validate feedback count
    if (result.feedback.length !== session.questions.length) {
      throw new Error(
        "Gemini returned an incorrect number of feedback entries.",
      );
    }

    // Validate scores
    const invalidScore = result.feedback.some(
      (item) =>
        typeof item.score !== "number" || item.score < 0 || item.score > 10,
    );

    if (invalidScore) {
      throw new Error("Gemini returned an invalid score.");
    }

    // Keep overall score between 0 and 100
    result.overallScore = Math.min(
      100,
      Math.max(0, Math.round(result.overallScore)),
    );

    return result;
  } catch (error) {
    console.error("Interview Evaluation Error:", error);

    throw new apiError("Failed to evaluate interview answers.", 500);
  }
};
