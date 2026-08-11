import axios from "./axiosConfig";

const BACKEND_URL = process.env.REACT_APP_API_URL;

// get dashboard data
export const getDashboardData = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/dashboard`);
  return data;
};
