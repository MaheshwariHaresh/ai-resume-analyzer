import Resume from "../models/Resume.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({
    user: req.user._id,
  })
    .select(
      "originalFileName analysis.atsScore analysis.overallVerdict uploadStatus createdAt",
    )
    .sort({ createdAt: -1 })
    .lean();

  // Total resumes
  const totalResumes = resumes.length;

  // Completed resumes
  const analyzedResumes = resumes.filter(
    (resume) => resume.uploadStatus === "completed",
  );

  // ATS scores
  const scores = analyzedResumes
    .map((resume) => resume.analysis?.atsScore)
    .filter((score) => typeof score === "number");

  // Average ATS score
  const averageATSScore = scores.length
    ? Math.round(
        scores.reduce((total, score) => total + score, 0) / scores.length,
      )
    : 0;

  // Highest ATS score
  const highestATSScore = scores.length ? Math.max(...scores) : 0;

  // Latest resume
  const latestResume = resumes[0] || null;

  // Recent resumes
  const recentResumes = resumes.slice(0, 5);

  return res.status(200).json({
    success: true,

    data: {
      statistics: {
        totalResumes,
        analyzedResumes: analyzedResumes.length,
        averageATSScore,
        highestATSScore,
      },

      latestResume,

      recentResumes,
    },
  });
});
