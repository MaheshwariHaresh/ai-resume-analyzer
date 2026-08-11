import { Router } from "express";

const router = Router();

import {
  generateInterviewQuestions,
  getInterviewSession,
  submitInterview,
  getInterviewHistory,
  saveInterviewProgress,
} from "../controllers/interviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

// Interview History
router.get("/history", getInterviewHistory);

// Get Single Interview Session
router.get("/:sessionId", getInterviewSession);

// Generate Interview Questions
router.post("/:resumeId/questions", generateInterviewQuestions);

// Save Interview Progress
router.put("/:sessionId/progress", saveInterviewProgress);
// Submit Interview
router.post("/:sessionId/submit", submitInterview);

export default router;
