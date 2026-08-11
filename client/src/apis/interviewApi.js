import axios from "./axiosConfig";

const BACKEND_URL = process.env.REACT_APP_API_URL;

// Get user's interview sessions
export const getInterviewSessions = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/interviews/history`);

  return data;
};

// Generate a new interview
export const startInterview = async (
  resumeId,
  interviewType,
  difficulty,
  questionCount,
) => {
  const response = await axios.post(
    `${BACKEND_URL}/interviews/${resumeId}/questions`,
    {
      interviewType,
      difficulty,
      questionCount,
    },
  );

  return response.data;
};

// Get a specific interview session by ID
export const getInterviewSession = async (sessionId) => {
  const { data } = await axios.get(`${BACKEND_URL}/interviews/${sessionId}`);

  return data;
};
// Save interview progress
export const saveInterviewProgress = async (sessionId, answers) => {
  const { data } = await axios.put(
    `${BACKEND_URL}/interviews/${sessionId}/progress`,
    {
      answers,
    },
  );

  return data;
};

// Submit Interview Session
export const submitInterviewSession = async (sessionId, answers) => {
  const { data } = await axios.post(
    `${BACKEND_URL}/interviews/${sessionId}/submit`,
    { answers },
  );

  return data;
};
