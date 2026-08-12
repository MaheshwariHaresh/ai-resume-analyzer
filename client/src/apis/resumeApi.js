import axios from "../apis/axiosConfig";

const BACKEND_URL = process.env.REACT_APP_API_URL;

// Public Resume Analysis
export const analyzePublicResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const { data } = await axios.post(
    `${BACKEND_URL}/resumes/public-analyze`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const { data } = await axios.post(`${BACKEND_URL}/resumes/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getMyResumes = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/resumes`);
  return data;
};

// get resume details by id
export const getResumeDetails = async (id) => {
  const { data } = await axios.get(`${BACKEND_URL}/resumes/${id}`);
  return data;
};

export const deleteResume = async (id) => {
  const { data } = await axios.delete(`${BACKEND_URL}/resumes/${id}`);
  return data;
};
