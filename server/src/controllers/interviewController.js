import Resume from "../models/Resume.js";
import InterviewSession from "../models/InterviewSession.js";

/**
 * @desc Generate Interview Questions
 * @route POST /api/interview/questions/:resumeId
 * @access Private
 */
export const generateInterviewQuestions = async (req, res) => {
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

    /*
        ==========================================
            AI Question Generation Will Come Here
        ==========================================
        */

    const questions = [
      {
        question: "Tell me about yourself.",
        difficulty: "Easy",
      },
      {
        question: "Explain the Event Loop in Node.js.",
        difficulty: "Medium",
      },
      {
        question: "What is JWT Authentication?",
        difficulty: "Medium",
      },
      {
        question: "Difference between SQL and MongoDB?",
        difficulty: "Medium",
      },
      {
        question: "Explain REST API.",
        difficulty: "Easy",
      },
      {
        question: "What is Middleware in Express?",
        difficulty: "Easy",
      },
      {
        question: "Explain Authentication vs Authorization.",
        difficulty: "Medium",
      },
      {
        question: "How does MongoDB store data?",
        difficulty: "Medium",
      },
      {
        question: "Explain MVC Architecture.",
        difficulty: "Hard",
      },
      {
        question: "How would you optimize a backend application?",
        difficulty: "Hard",
      },
    ];

    const session = await InterviewSession.create({
      resume: resume._id,
      questions,
    });

    return res.status(201).json({
      success: true,
      message: "Interview questions generated successfully.",
      data: session,
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
 * @desc Submit Interview Answers
 * @route POST /api/interview/submit/:sessionId
 * @access Private
 */
export const submitInterview = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { answers } = req.body;

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
      });
    }

    /*
        ======================================
            AI Evaluation Will Come Here
        ======================================
        */

    const feedback = answers.map((item) => ({
      question: item.question,
      score: 8,
      suggestion: "Good answer. Add more practical examples.",
    }));

    session.answers = answers;
    session.feedback = feedback;
    session.overallScore = 80;
    session.status = "completed";

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Interview submitted successfully.",
      data: session,
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
 * @desc Get Interview History
 * @route GET /api/interview/history
 * @access Private
 */
export const getInterviewHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    }).select("_id");

    const resumeIds = resumes.map((resume) => resume._id);

    const history = await InterviewSession.find({
      resume: { $in: resumeIds },
    })
      .populate("resume", "originalFileName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
