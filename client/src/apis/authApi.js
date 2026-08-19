import axios from "./axiosConfig";

/*
 * LOGIN USER
 *
 * Backend:
 * POST /api/v1/auth/login
 *
 * Returns:
 * {
 *   accessToken,
 *   user
 * }
 *
 * Refresh token is automatically stored by the backend
 * as an HttpOnly cookie.
 */
export const loginUser = async (payload) => {
  const { data } = await axios.post("/auth/login", payload);

  return data;
};

/*
 * REGISTER USER
 *
 * Backend:
 * POST /api/v1/auth/register
 */
export const registerUser = async (payload) => {
  const { data } = await axios.post("/auth/register", payload);

  return data;
};

/*
 * REFRESH ACCESS TOKEN
 *
 * Browser automatically sends the HttpOnly refresh-token
 * cookie because axiosConfig has withCredentials: true.
 *
 * Normally axiosConfig handles this automatically when
 * an API request receives a 401.
 */
export const refreshAccessToken = async () => {
  const { data } = await axios.post("/auth/refresh");

  return data;
};

/*
 * LOGOUT USER
 *
 * Backend:
 * POST /api/v1/auth/logout
 *
 * Backend revokes the refresh token and clears the
 * HttpOnly cookie.
 */
export const logoutUser = async () => {
  const { data } = await axios.post("/auth/logout");

  return data;
};

/*
 * GOOGLE LOGIN
 *
 * Backend:
 * POST /api/v1/auth/google
 *
 * Sends the Google ID token to the backend.
 *
 * Backend verifies the token and returns:
 * {
 *   accessToken,
 *   user
 * }
 *
 * Refresh token is automatically stored by the backend
 * as an HttpOnly cookie.
 */
export const googleLoginUser = async (idToken) => {
  const { data } = await axios.post("/auth/google", {
    idToken,
  });

  return data;
};
