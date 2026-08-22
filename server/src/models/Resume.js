import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    // Job Description used for this resume analysis
    jobDescription: {
      type: String,
      default: "",
      trim: true,
    },

    analysis: {
      atsScore: {
        type: Number,
        default: 0,
      },

      overallVerdict: {
        type: String,
        default: "",
      },

      summary: {
        type: String,
        default: "",
      },

      sectionScores: {
        contactInfo: {
          type: Number,
          default: 0,
        },

        experience: {
          type: Number,
          default: 0,
        },

        skills: {
          type: Number,
          default: 0,
        },

        education: {
          type: Number,
          default: 0,
        },

        projects: {
          type: Number,
          default: 0,
        },

        keywords: {
          type: Number,
          default: 0,
        },

        formatting: {
          type: Number,
          default: 0,
        },
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      missingSkills: {
        type: [String],
        default: [],
      },

      suggestions: {
        type: [String],
        default: [],
      },

      interviewQuestions: {
        type: [String],
        default: [],
      },

      // JD-specific analysis
      jobAnalysis: {
        matchScore: {
          type: Number,
          default: null,
        },

        matchSummary: {
          type: String,
          default: "",
        },

        matchingSkills: {
          type: [String],
          default: [],
        },

        missingSkills: {
          type: [String],
          default: [],
        },

        suggestions: {
          type: [String],
          default: [],
        },
      },
    },

    uploadStatus: {
      type: String,
      enum: ["uploaded", "analyzing", "completed", "failed"],
      default: "uploaded",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Resume", resumeSchema);
