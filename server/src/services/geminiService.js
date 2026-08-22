import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import apiError from "../utils/apiError.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
// Analyze Resume
export const analyzeResume = async (
  filePath,
  mimeType,
  jobDescription = "",
) => {
  try {
    const file = fs.readFileSync(filePath);

    const normalizedJobDescription =
      typeof jobDescription === "string" ? jobDescription.trim() : "";

    const hasJobDescription = normalizedJobDescription.length > 0;

    const prompt = `
You are an expert ATS Resume Analyzer and Job Matching Assistant.

The resume is provided separately as an attached file.

Analyze the attached resume professionally from the perspective of:

- ATS compatibility
- Resume quality
- Recruiter readability
- Technical/professional relevance
- Skills presentation
- Experience quality
- Project quality
- Resume formatting

${
  hasJobDescription
    ? `
JOB DESCRIPTION:

${normalizedJobDescription}

IMPORTANT:

The user has provided a job description.

You MUST evaluate the attached resume against this specific job description.

Identify:

- Relevant matching skills
- Important skills from the job description that are absent or weakly represented in the resume
- Missing keywords that are genuinely relevant to this specific job
- Gaps between the candidate profile and the job requirements
- A realistic job match score
- Specific recommendations for improving the resume for this job

Do NOT assume that every technology mentioned in the job description is mandatory unless the job description clearly indicates that it is required.

Only identify a skill as missing when:

- It is explicitly mentioned or clearly required by the job description
- It is genuinely relevant to the role
- It is not clearly present in the resume

Do not invent candidate experience with any technology or responsibility.
`
    : `
NO JOB DESCRIPTION PROVIDED.

Analyze the resume independently based on the candidate's existing career direction.

Do NOT perform job-specific matching.

Do NOT:

- calculate a job match score
- identify job-specific missing skills
- claim that any skill is required
- create job-specific recommendations

Recommended skills should only include technologies, tools, practices, or capabilities that are genuinely relevant to the candidate's current profile and career direction.
`
}

Return ONLY valid JSON.

Never use markdown.
Never wrap response inside code fences.

Return exactly this JSON structure:

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
  "recommendedSkills": [],
  "suggestions": [],
  "interviewQuestions": [],

  "jobAnalysis": {
    "matchScore": null,
    "matchSummary": "",
    "matchingSkills": [],
    "missingSkills": [],
    "suggestions": []
  }
}

IMPORTANT RULES:

1. ATS Score must be between 0 and 100.

2. overallVerdict must be exactly one of:

   - Excellent
   - Good
   - Average
   - Poor

3. Summary should contain 4-5 concise lines.

4. Identify strengths based ONLY on information actually present in the resume.

5. Identify weaknesses based ONLY on actual problems or gaps visible in the resume.

6. Do NOT invent experience, skills, certifications, projects, education, or technologies.

7. recommendedSkills must contain skills that would genuinely strengthen the candidate's profile.

8. If a job description is provided, recommendedSkills should prioritize skills that:

   - are relevant to the job description
   - are absent or weakly represented in the resume
   - align with the candidate's existing career direction

9. If no job description is provided, recommendedSkills should be based on:

   - existing technologies
   - existing projects
   - career direction
   - demonstrated technical level

10. Do NOT classify a skill as missing simply because it is popular in the technology industry.

11. Do NOT automatically recommend Docker, Kubernetes, AWS, CI/CD, Redis, or other technologies unless they are genuinely relevant.

12. Never claim that a skill is required unless the job description explicitly indicates that requirement.

13. Do NOT recommend a technology only because it appears in the job description if it has no meaningful relevance to the candidate's career direction.

14. If there are no clearly useful recommended skills, return an empty array.

15. Suggestions must be specific and actionable for THIS resume.

16. If a job description is provided, suggestions should also explain how the resume could be improved for that specific job.

17. Interview questions should primarily be based on:

   - technologies actually mentioned in the resume
   - projects actually mentioned in the resume
   - experience actually mentioned in the resume
   - skills actually mentioned in the resume

18. If a job description is provided, some interview questions may also target important responsibilities or technologies mentioned in the job description.

However, NEVER assume the candidate has experience with a technology merely because it appears in the job description.

19. If NO job description is provided:

   jobAnalysis.matchScore MUST be null.

   jobAnalysis.matchSummary MUST be "".

   jobAnalysis.matchingSkills MUST be [].

   jobAnalysis.missingSkills MUST be [].

   jobAnalysis.suggestions MUST be [].

20. If a job description IS provided:

   jobAnalysis.matchScore MUST be between 0 and 100.

   jobAnalysis.matchSummary must briefly explain the candidate's fit for the job.

   jobAnalysis.matchingSkills must contain only skills actually supported by the resume and relevant to the job description.

   jobAnalysis.missingSkills must contain only genuinely relevant skills explicitly required or strongly requested by the job description and not clearly present in the resume.

   jobAnalysis.suggestions must contain specific recommendations for improving the resume for this particular job.

21. Generate approximately:

   - 5 relevant strengths
   - 5 relevant weaknesses
   - 3-6 relevant recommended skills
   - 5-8 actionable suggestions
   - 10 interview questions

22. Quality is more important than quantity.

23. Do not invent information just to satisfy a requested number.

24. The resume is provided as an attached file. Analyze that attached resume directly.

25. Do not expect or require resume text to be provided inside this prompt.

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

        let text = response.text?.trim();

        if (!text) {
          throw new Error("Gemini returned an empty response.");
        }

        // Remove markdown code fences if Gemini adds them
        text = text
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const analysis = JSON.parse(text);

        /*
         * Ensure response always has the expected structure.
         * This prevents frontend crashes when Gemini omits an optional field.
         */
        return {
          atsScore:
            typeof analysis.atsScore === "number"
              ? Math.min(Math.max(analysis.atsScore, 0), 100)
              : 0,

          overallVerdict: analysis.overallVerdict || "Average",

          summary: analysis.summary || "",

          sectionScores: {
            contactInfo: analysis.sectionScores?.contactInfo || 0,
            experience: analysis.sectionScores?.experience || 0,
            skills: analysis.sectionScores?.skills || 0,
            education: analysis.sectionScores?.education || 0,
            projects: analysis.sectionScores?.projects || 0,
            keywords: analysis.sectionScores?.keywords || 0,
            formatting: analysis.sectionScores?.formatting || 0,
          },

          strengths: Array.isArray(analysis.strengths)
            ? analysis.strengths
            : [],

          weaknesses: Array.isArray(analysis.weaknesses)
            ? analysis.weaknesses
            : [],

          recommendedSkills: Array.isArray(analysis.recommendedSkills)
            ? analysis.recommendedSkills
            : [],

          suggestions: Array.isArray(analysis.suggestions)
            ? analysis.suggestions
            : [],

          interviewQuestions: Array.isArray(analysis.interviewQuestions)
            ? analysis.interviewQuestions
            : [],

          jobAnalysis: {
            matchScore:
              hasJobDescription &&
              typeof analysis.jobAnalysis?.matchScore === "number"
                ? Math.min(Math.max(analysis.jobAnalysis.matchScore, 0), 100)
                : null,

            matchSummary:
              hasJobDescription && analysis.jobAnalysis?.matchSummary
                ? analysis.jobAnalysis.matchSummary
                : "",

            matchingSkills:
              hasJobDescription &&
              Array.isArray(analysis.jobAnalysis?.matchingSkills)
                ? analysis.jobAnalysis.matchingSkills
                : [],

            missingSkills:
              hasJobDescription &&
              Array.isArray(analysis.jobAnalysis?.missingSkills)
                ? analysis.jobAnalysis.missingSkills
                : [],

            suggestions:
              hasJobDescription &&
              Array.isArray(analysis.jobAnalysis?.suggestions)
                ? analysis.jobAnalysis.suggestions
                : [],
          },
        };
      } catch (error) {
        console.error(
          `Gemini analysis attempt ${attempt}/${maxAttempts} failed:`,
          error,
        );

        const isTemporaryError =
          error?.status === 503 ||
          error?.error?.code === 503 ||
          error?.error?.status === "UNAVAILABLE";

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
