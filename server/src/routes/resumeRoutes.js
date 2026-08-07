import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Upload Resume
router.post("/upload", upload.single("resume"), uploadResume);

// Get Logged-in User's Resumes
router.get("/", getMyResumes);

// Get Resume by ID
router.get("/:id", getResumeById);

// Delete Resume
router.delete("/:id", deleteResume);

export default router;
