import jwt from "jsonwebtoken";

/*
 * Generate short-lived access token.
 *
 * Access token is used for authenticated API requests.
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      type: "access",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

/*
 * Generate long-lived refresh token.
 *
 * Refresh token is used only to obtain a new access token.
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
