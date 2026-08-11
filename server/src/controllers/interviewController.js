import Resume from "../models/Resume.js";
import InterviewSession from "../models/InterviewSession.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import {
  generateInterviewQuestions as generateAIQuestions,
  evaluateInterviewAnswers,
} from "../services/geminiService.js";

export const generateInterviewQuestions = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  const {
    interviewType = "Technical",
    difficulty = "Medium",
    questionCount = 10,
  } = req.body;

  // Find user's resume
  const resume = await Resume.findOne({
    _id: resumeId,
    user: req.user._id,
  });

  if (!resume) {
    throw new apiError("Resume not found.", 404);
  }

  // Resume must be analyzed first
  if (resume.uploadStatus !== "completed") {
    throw new apiError(
      "Please analyze your resume before starting an interview.",
      400,
    );
  }

  // Validate interview type
  const allowedInterviewTypes = ["Technical", "HR", "Behavioral", "Mixed"];

  if (!allowedInterviewTypes.includes(interviewType)) {
    throw new apiError("Invalid interview type.", 400);
  }

  // Validate difficulty
  const allowedDifficulties = ["Easy", "Medium", "Hard"];

  if (!allowedDifficulties.includes(difficulty)) {
    throw new apiError("Invalid difficulty level.", 400);
  }

  // Validate question count
  const allowedQuestionCounts = [5, 10, 15, 20];

  if (!allowedQuestionCounts.includes(Number(questionCount))) {
    throw new apiError("Invalid question count.", 400);
  }

  // Generate questions using Gemini
  const questions = await generateAIQuestions(
    resume,
    interviewType,
    difficulty,
    Number(questionCount),
  );

  if (!questions || questions.length === 0) {
    throw new apiError("Failed to generate interview questions.", 500);
  }

  // Create interview session
  const session = await InterviewSession.create({
    user: req.user._id,
    resume: resume._id,

    interviewType,
    difficulty,
    questionCount: Number(questionCount),

    questions,

    status: "pending",
  });

  return res.status(201).json({
    success: true,
    message: "Interview questions generated successfully.",
    data: session,
  });
});

export const saveInterviewProgress = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    throw new apiError("Invalid answers data.", 400);
  }

  const session = await InterviewSession.findOne({
    _id: sessionId,
    user: req.user._id,
  });

  if (!session) {
    throw new apiError("Interview session not found.", 404);
  }

  // Don't allow changes after completion
  if (session.status === "completed") {
    throw new apiError("This interview has already been completed.", 400);
  }

  session.answers = answers;

  // Once the user starts answering, mark it in-progress
  if (session.status === "pending") {
    session.status = "in-progress";
  }

  await session.save();

  return res.status(200).json({
    success: true,
    message: "Interview progress saved successfully.",
    data: {
      answers: session.answers,
      status: session.status,
    },
  });
});
/**
 * @desc Submit Interview Answers
 * @route POST /api/interview/submit/:sessionId
 * @access Private
 */
export const submitInterview = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { answers } = req.body;

  // Find interview session belonging to logged-in user
  const session = await InterviewSession.findOne({
    _id: sessionId,
    user: req.user._id,
  });

  if (!session) {
    throw new apiError("Interview session not found.", 404);
  }

  // Prevent submitting an already completed interview
  if (session.status === "completed") {
    throw new apiError("Interview has already been submitted.", 400);
  }

  // Validate answers
  if (!answers || !Array.isArray(answers)) {
    throw new apiError("Answers are required.", 400);
  }

  if (answers.length !== session.questions.length) {
    throw new apiError(
      `Please answer all ${session.questions.length} questions.`,
      400,
    );
  }

  // Validate each answer
  const formattedAnswers = session.questions.map((question, index) => ({
    question: question.question,
    answer: answers[index]?.answer?.trim() || "",
  }));

  // Make sure every question has an answer
  const unanswered = formattedAnswers.some((item) => !item.answer);

  if (unanswered) {
    throw new apiError(
      "Please answer all questions before submitting the interview.",
      400,
    );
  }

  // Save answers first
  session.answers = formattedAnswers;
  session.status = "in-progress";

  await session.save();

  // AI evaluation will come here
  const evaluation = await evaluateInterviewAnswers(session);

  if (
    !evaluation ||
    !Array.isArray(evaluation.feedback) ||
    typeof evaluation.overallScore !== "number"
  ) {
    throw new apiError("Failed to evaluate interview answers.", 500);
  }

  // Save AI feedback and final score
  session.feedback = evaluation.feedback;
  session.overallScore = evaluation.overallScore;
  session.status = "completed";

  await session.save();

  return res.status(200).json({
    success: true,
    message: "Interview submitted and evaluated successfully.",
    data: session,
  });
});

/**
 * @desc Get Interview History
 * @route GET /api/interview/history
 * @access Private
 */
export const getInterviewHistory = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({
    user: req.user._id,
  }).select("_id");

  const resumeIds = resumes.map((resume) => resume._id);

  const history = await InterviewSession.find({
    resume: { $in: resumeIds },
  })
    .populate("resume", "originalFileName")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
});

export const getInterviewSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await InterviewSession.findOne({
    _id: sessionId,
    user: req.user._id,
  }).populate("resume", "originalFileName");

  if (!session) {
    throw new apiError("Interview session not found.", 404);
  }

  return res.status(200).json({
    success: true,
    data: session,
  });
});
