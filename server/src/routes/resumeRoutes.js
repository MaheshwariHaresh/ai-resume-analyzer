import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  publicAnalyzeResume,
} from "../controllers/resumeController.js";

const router = Router();

// Upload Resume Public Publically
router.post("/public-analyze", upload.single("resume"), publicAnalyzeResume);

// Protected Routes
router.use(authMiddleware);

router.post("/upload", upload.single("resume"), uploadResume);

router.get("/", getMyResumes);

router.get("/:id", getResumeById);

router.delete("/:id", deleteResume);

export default router;
