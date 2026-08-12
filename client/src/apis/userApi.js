import axios from "./axiosConfig";

const BACKEND_URL = process.env.REACT_APP_API_URL;

// Get logged-in user's profile
export const getMyProfile = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/users/profile`);

  return data;
};

// Update logged-in user's profile
export const updateMyProfile = async (profileData) => {
  const { data } = await axios.put(`${BACKEND_URL}/users/profile`, profileData);

  return data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await axios.patch(`${BACKEND_URL}/users/change-password`, {
    currentPassword,
    newPassword,
  });

  return data;
};

export const deleteAccount = async () => {
  const { data } = await axios.delete(`${BACKEND_URL}/users/account`);

  return data;
};
