import Resume from "../models/Resume.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import InterviewSession from "../models/InterviewSession.js";

export const getDashboard = async (req, res) => {
  try {
    // Logged-in user's resumes
    const resumes = await Resume.find({ user: req.user._id }).select("_id");

    const resumeIds = resumes.map((resume) => resume._id);

    // Statistics
    const totalResumes = resumeIds.length;

    const totalAnalyses = await ResumeAnalysis.countDocuments({
      resume: { $in: resumeIds },
    });

    const totalInterviews = await InterviewSession.countDocuments({
      resume: { $in: resumeIds },
    });

    const completedInterviews = await InterviewSession.countDocuments({
      resume: { $in: resumeIds },
      status: "completed",
    });

    // Latest Resume
    const latestResume = await Resume.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    // Latest Analysis
    const latestAnalysis = await ResumeAnalysis.findOne({
      resume: { $in: resumeIds },
    })
      .populate("resume", "originalFileName")
      .sort({ createdAt: -1 });

    // Latest Interview
    const latestInterview = await InterviewSession.findOne({
      resume: { $in: resumeIds },
    })
      .populate("resume", "originalFileName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalResumes,
          totalAnalyses,
          totalInterviews,
          completedInterviews,
        },

        latestResume,
        latestAnalysis,
        latestInterview,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
