import axios from "./axiosConfig";

const BACKEND_URL = process.env.REACT_APP_API_URL;
// LOGIN USER API
export const loginUser = async (payload) => {
  const { data } = await axios.post(`${BACKEND_URL}/auth/login`, payload);

  return data;
};

// REGISTER USER API
export const registerUser = async (payload) => {
  const { data } = await axios.post(`${BACKEND_URL}/auth/register`, payload);

  return data;
};
