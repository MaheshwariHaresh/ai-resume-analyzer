import axios from "../apis/axiosConfig";

const BACKEND_URL = process.env.REACT_APP_API_URL;
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
