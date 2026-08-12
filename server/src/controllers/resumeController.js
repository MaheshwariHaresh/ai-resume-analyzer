import Resume from "../models/Resume.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { uploadResumeToCloudinary } from "../services/cloudinaryService.js";
import { analyzeResume } from "../services/geminiService.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

/**
 * @desc Public Resume Analysis
 * @route POST /api/resumes/public-analyze
 * @access Public
 */
export const publicAnalyzeResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new apiError("Please upload a resume.", 400);
  }

  try {
    // Analyze resume using Gemini
    const analysis = await analyzeResume(req.file.path, req.file.mimetype);

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully.",
      data: {
        analysis,
      },
    });
  } catch (error) {
    throw error;
  } finally {
    // Delete temporary uploaded file
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error("Temporary file deletion failed:", error);
      }
    }
  }
});

/**
 * @desc Upload Resume
 * @route POST /api/resumes/upload
 * @access Private
 */

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new apiError("Please upload a resume.", 400);
  }

  try {
    // Upload to Cloudinary
    const uploadResult = await uploadResumeToCloudinary(req.file.path);

    // Analyze Resume
    const analysis = await analyzeResume(req.file.path, req.file.mimetype);

    // Save MongoDB
    const resume = await Resume.create({
      user: req.user._id,

      originalFileName: req.file.originalname,

      cloudinaryId: uploadResult.publicId,

      fileUrl: uploadResult.secureUrl,

      analysis,

      uploadStatus: "completed",
    });

    // Delete local file
    await fs.unlink(req.file.path);

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully.",
      data: resume,
    });
  } catch (error) {
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch {}
    }

    throw error;
  }
});

/**
 * @desc Get All Resumes of Logged-in User
 * @route GET /api/resumes
 * @access Private
 */
export const getMyResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .select(
      "originalFileName fileUrl uploadStatus analysis.atsScore analysis.overallVerdict createdAt",
    )
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    count: resumes.length,
    data: resumes,
  });
});

/**
 * @desc Get Single Resume
 * @route GET /api/resumes/:id
 * @access Private
 */
export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new apiError("Resume not found.", 404);
  }

  return res.status(200).json({
    success: true,
    data: resume,
  });
});

/**
 * @desc Delete Resume
 * @route DELETE /api/resumes/:id
 * @access Private
 */

export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new apiError("Resume not found.", 404);
  }

  // Delete file from Cloudinary
  if (resume.cloudinaryId) {
    await cloudinary.uploader.destroy(resume.cloudinaryId, {
      resource_type: "raw",
    });
  }

  // Delete MongoDB record
  await resume.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Resume deleted successfully.",
  });
});
