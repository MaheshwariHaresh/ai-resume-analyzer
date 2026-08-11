import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    // Interview Configuration
    interviewType: {
      type: String,
      enum: ["Technical", "HR", "Behavioral", "Mixed"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    questionCount: {
      type: Number,
      enum: [5, 10, 15, 20],
      required: true,
    },

    // Generated Questions
    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          default: "Medium",
        },
      },
    ],

    // User Answers
    answers: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },
      },
    ],

    // AI Feedback
    feedback: [
      {
        question: {
          type: String,
          required: true,
        },

        score: {
          type: Number,
          min: 0,
          max: 10,
          default: 0,
        },

        suggestion: {
          type: String,
          default: "",
        },
      },
    ],

    // Final Interview Score
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("InterviewSession", interviewSessionSchema);
