import Resume from "../models/Resume.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

/**
 * @desc Analyze Resume
 * @route POST /api/analysis/:resumeId
 * @access Private
 */
export const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Find Resume
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    // Check if already analyzed
    const existingAnalysis = await ResumeAnalysis.findOne({
      resume: resumeId,
    });

    if (existingAnalysis) {
      return res.status(400).json({
        success: false,
        message: "Resume has already been analyzed.",
      });
    }

    /*
        ===================================================
                AI ANALYSIS WILL BE ADDED HERE
        ===================================================
        */

    const analysis = await ResumeAnalysis.create({
      resume: resume._id,

      overallScore: 82,
      atsScore: 78,

      summary:
        "Strong backend profile with good Node.js and Express.js knowledge.",

      strengths: [
        "Good project experience",
        "Clean technical skills",
        "Well structured resume",
      ],

      weaknesses: ["No certifications", "Missing Docker experience"],

      skillsFound: ["JavaScript", "Node.js", "Express.js", "MongoDB"],

      missingSkills: ["Docker", "AWS", "Redis"],

      grammarSuggestions: ["Improve action verbs."],

      improvementSuggestions: [
        "Add measurable achievements.",
        "Mention internship experience.",
      ],

      analyzedBy: "AI",
    });

    // Update Resume Status
    resume.uploadStatus = "analyzed";
    await resume.save();

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully.",
      data: analysis,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * @desc Get Resume Analysis
 * @route GET /api/analysis/:resumeId
 * @access Private
 */
export const getAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const analysis = await ResumeAnalysis.findOne({
      resume: resumeId,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * @desc Reanalyze Resume
 * @route PUT /api/analysis/reanalyze/:resumeId
 * @access Private
 */
export const reAnalyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const analysis = await ResumeAnalysis.findOne({
      resume: resumeId,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found.",
      });
    }

    /*
        ===================================================
           HERE WE WILL CALL AI AGAIN IN THE FUTURE
        ===================================================
        */

    analysis.overallScore = 90;
    analysis.atsScore = 88;

    analysis.improvementSuggestions = [
      "Include more quantified achievements.",
      "Add cloud deployment experience.",
      "Highlight backend architecture skills.",
    ];

    analysis.summary =
      "Resume successfully reanalyzed using the latest AI model.";

    await analysis.save();

    return res.status(200).json({
      success: true,
      message: "Resume reanalyzed successfully.",
      data: analysis,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
