import express from "express";
const router = express.Router();

import {
  generateInterviewQuestions,
  submitInterview,
  getInterviewHistory,
} from "../controllers/interviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

// Generate Questions
router.post("/questions/:resumeId", generateInterviewQuestions);

// Submit Interview
router.post("/submit/:sessionId", submitInterview);

// Interview History
router.get("/history", getInterviewHistory);

export default router;
