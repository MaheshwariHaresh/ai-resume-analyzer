import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { refreshAccessToken, logoutUser } from "../apis/authApi";
import { setSkipAuthRefresh } from "../apis/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Save user locally.
   *
   * User information is not a credential, so it is okay
   * to persist basic user information in localStorage.
   */
  const saveUser = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const saveAccessToken = (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  };

  /*
   * Clear local authentication state.
   */
  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }, []);

  /*
   * Restore authentication when application starts.
   *
   * We do NOT treat the localStorage access token as a valid
   * session by itself.
   *
   * If one exists, it is only a hint that the user previously
   * logged in, so we ask the backend for a new access token.
   * The browser automatically sends the HttpOnly refresh cookie.
   *
   * If there is no local access token, the user is logged out
   * and we must not call /auth/refresh.
   */
  const restoreSession = useCallback(async () => {
    const storedAccessToken = localStorage.getItem("accessToken");

    if (!storedAccessToken) {
      clearAuth();
      setLoading(false);
      return;
    }

    try {
      const data = await refreshAccessToken();

      if (data?.success && data?.accessToken) {
        saveAccessToken(data.accessToken);
        setAccessToken(data.accessToken);

        if (data.user) {
          setUser(data.user);
          saveUser(data.user);
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      /*
       * No valid refresh token means the user is not logged in.
       */
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  /*
   * Restore session once when application starts.
   */
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  /*
   * Login
   *
   * Backend returns:
   *
   * {
   *   accessToken,
   *   user
   * }
   *
   * Refresh token is stored automatically by the browser
   * inside an HttpOnly cookie.
   */
  const login = async (userData, token) => {
    setSkipAuthRefresh(false);

    setUser(userData);
    setAccessToken(token);

    saveUser(userData);
    saveAccessToken(token);
  };

  /*
   * Register
   *
   * Registration uses the same authentication flow as login.
   */
  const register = async (userData, token) => {
    setSkipAuthRefresh(false);

    setUser(userData);
    setAccessToken(token);

    saveUser(userData);
    saveAccessToken(token);
  };

  /*
   * Update access token.
   *
   * Axios interceptor will use this when a new access token
   * is generated through the refresh endpoint.
   */
  const updateAccessToken = useCallback((token) => {
    setAccessToken(token);
    saveAccessToken(token);
  }, []);

  /*
   * Update user information.
   */
  const updateUser = (userData) => {
    setUser(userData);
    saveUser(userData);
  };

  /*
   * Logout
   *
   * Backend revokes the refresh token and clears its cookie.
   *
   * Local state is cleared regardless of whether the API
   * request succeeds or fails.
   */
  const logout = async () => {
    setSkipAuthRefresh(true);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API Error:", error);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,

        login,
        register,
        logout,

        updateUser,
        updateAccessToken,

        clearAuth,

        isAuthenticated: !!user && !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
