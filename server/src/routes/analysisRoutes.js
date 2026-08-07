import express from "express";
const router = express.Router();

import {
  analyzeResume,
  getAnalysis,
  reAnalyzeResume,
} from "../controllers/analysisController.js";

import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

// Analyze Resume
router.post("/:resumeId", analyzeResume);

// Get Analysis
router.get("/:resumeId", getAnalysis);

// Reanalyze Resume
router.put("/reanalyze/:resumeId", reAnalyzeResume);

export default router;
