import axios from "axios";

/*
 * Main Axios instance
 *
 * Used for all authenticated API requests.
 */
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/*
 * Separate Axios instance for refreshing the access token.
 *
 * IMPORTANT:
 * We don't use axiosInstance here because that would trigger
 * the response interceptor again and could create a refresh loop.
 */
const refreshClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/*
 * Prevent multiple refresh requests at the same time.
 *
 * Example:
 *
 * Request A → 401
 * Request B → 401
 * Request C → 401
 *
 * Instead of sending 3 refresh requests,
 * all requests wait for the same refresh operation.
 */
let refreshPromise = null;

/*
 * Prevent automatic token refresh during logout
 * and after authentication has already been cleared.
 */
let skipAuthRefresh = false;

export const setSkipAuthRefresh = (value) => {
  skipAuthRefresh = value;
};

/*
 * Request Interceptor
 *
 * Attach the current access token to every API request.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/*
 * Response Interceptor
 *
 * If the access token expires:
 *
 * 1. Call /auth/refresh
 * 2. Browser automatically sends HttpOnly refresh cookie
 * 3. Receive new access token
 * 4. Store new access token
 * 5. Retry original request
 *
 * If refresh fails:
 * → Clear authentication data
 * → Reject request
 */
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    /*
     * Only handle 401 responses.
     */
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest?.url || "";

    /*
     * Don't try to refresh when:
     * - logout is in progress / already completed
     * - the failed request is /auth/refresh
     * - the failed request is /auth/logout
     * - the access token has already been cleared
     */
    if (
      skipAuthRefresh ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout") ||
      !localStorage.getItem("accessToken")
    ) {
      return Promise.reject(error);
    }

    /*
     * Prevent infinite retry loops.
     */
    if (originalRequest._retry) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      /*
       * If another request is already refreshing the token,
       * wait for that same promise.
       *
       * Otherwise start a new refresh request.
       */
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post("/auth/refresh")
          .then((response) => {
            const newAccessToken = response.data.accessToken;

            if (!newAccessToken) {
              throw new Error("No access token returned from refresh.");
            }

            /*
             * Store the new short-lived access token.
             */
            localStorage.setItem("accessToken", newAccessToken);

            /*
             * Update user information if returned by backend.
             */
            if (response.data.user) {
              localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            return newAccessToken;
          })
          .finally(() => {
            /*
             * Allow another refresh in the future
             * after this operation finishes.
             */
            refreshPromise = null;
          });
      }

      /*
       * Wait for the refresh operation.
       */
      const newAccessToken = await refreshPromise;

      /*
       * Attach the new token to the original request.
       */
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      /*
       * Retry the original API request.
       */
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      /*
       * Refresh token is invalid/expired/revoked.
       *
       * User must log in again.
       */
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
