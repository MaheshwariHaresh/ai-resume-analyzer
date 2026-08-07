import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    questions: [
      {
        question: String,
        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          default: "Medium",
        },
      },
    ],

    answers: [
      {
        question: String,
        answer: String,
      },
    ],

    feedback: [
      {
        question: String,
        score: Number,
        suggestion: String,
      },
    ],

    overallScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("InterviewSession", interviewSessionSchema);
