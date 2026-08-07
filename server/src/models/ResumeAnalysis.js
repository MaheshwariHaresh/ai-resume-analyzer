import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    skillsFound: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    grammarSuggestions: [
      {
        type: String,
      },
    ],

    improvementSuggestions: [
      {
        type: String,
      },
    ],

    analyzedBy: {
      type: String,
      default: "AI",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
