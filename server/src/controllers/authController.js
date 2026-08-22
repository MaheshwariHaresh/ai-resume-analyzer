import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
/*
 * Refresh token configuration
 */
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

/*
 * Refresh token cookie configuration
 *
 * HttpOnly:
 * Prevents JavaScript from accessing the refresh token.
 *
 * Secure:
 * Cookie is sent only over HTTPS in production.
 *
 * SameSite:
 * Allows the cookie to work correctly between
 * frontend and backend when deployed separately.
 */
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth",
};

/*
 * Hash refresh token before storing it in MongoDB.
 *
 * We never store the actual refresh token in the database.
 */
const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/*
 * Create refresh token and store its hash in MongoDB.
 */
const createRefreshToken = async (userId) => {
  const refreshToken = generateRefreshToken(userId);

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const refreshTokenExpiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );

  await User.findByIdAndUpdate(userId, {
    refreshTokenHash,
    refreshTokenExpiresAt,
  });

  return refreshToken;
};

/*
 * Set refresh token as HttpOnly cookie.
 */
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
};

/*
 * Clear refresh token cookie.
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api/v1/auth",
  });
};

/*
 * Return safe user information.
 *
 * Password and refresh-token fields are never exposed.
 */
const getUserResponse = (user) => {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profession: user.profession,
    location: user.location,
    experience: user.experience,
  };
};

/**
 * @route POST /api/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  /*
   * Validation
   */
  if (!fullName || !email || !password) {
    throw new apiError(400, "All fields are required.");
  }

  /*
   * Check existing user
   */
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new apiError(409, "Email already registered.");
  }

  /*
   * Hash password
   */
  const hashedPassword = await bcrypt.hash(password, 10);

  /*
   * Create user
   */
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  /*
   * Generate short-lived access token.
   */
  const accessToken = generateAccessToken(user._id);

  /*
   * Generate and store refresh token.
   */
  const refreshToken = await createRefreshToken(user._id);

  /*
   * Store refresh token in HttpOnly cookie.
   */
  setRefreshTokenCookie(res, refreshToken);

  /*
   * Return access token to frontend.
   *
   * Refresh token is intentionally NOT returned
   * in the JSON response.
   */
  return res.status(201).json({
    success: true,
    message: "Registration successful.",
    accessToken,
    user: getUserResponse(user),
  });
});

/**
 * @route POST /api/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  /*
   * Validation
   */
  if (!email || !password) {
    throw new apiError(400, "Email and password are required.");
  }

  /*
   * Find user
   */
  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(401, "Invalid email or password.");
  }

  /*
   * Check whether the account has a password.
   *
   * Google-authenticated users may not have a password.
   */
  if (!user.password) {
    throw new apiError(
      401,
      "This account uses Google Sign-In. Please continue with Google.",
    );
  }

  /*
   * Compare password
   */
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new apiError(401, "Invalid email or password.");
  }

  /*
   * Generate short-lived access token.
   */
  const accessToken = generateAccessToken(user._id);

  /*
   * Generate and store refresh token hash.
   */
  const refreshToken = await createRefreshToken(user._id);

  /*
   * Store refresh token in HttpOnly cookie.
   */
  setRefreshTokenCookie(res, refreshToken);

  /*
   * Return access token and user information.
   */
  return res.status(200).json({
    success: true,
    message: "Login successful.",
    accessToken,
    user: getUserResponse(user),
  });
});

/**
 * @route POST /api/auth/google
 * @access Public
 *
 * Authenticate user using Google ID token.
 */
export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  /*
   * Google ID token is required.
   */
  if (!idToken) {
    throw new apiError(400, "Google ID token is required.");
  }

  /*
   * Verify Google ID token.
   */
  let ticket;

  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (error) {
    throw new apiError(401, "Invalid Google ID token.");
  }

  /*
   * Get verified Google user information.
   */
  const payload = ticket.getPayload();

  const googleId = payload.sub;
  const email = payload.email;
  const fullName = payload.name;
  const emailVerified = payload.email_verified;

  /*
   * Make sure Google account has a verified email.
   */
  if (!googleId || !email || !emailVerified) {
    throw new apiError(401, "Google account information is invalid.");
  }

  /*
   * Find existing user by Google ID.
   */
  let user = await User.findOne({ googleId });

  /*
   * If Google ID does not exist, check whether
   * the email already belongs to an existing account.
   */
  if (!user) {
    user = await User.findOne({ email });

    /*
     * Existing email/password account:
     * link the Google account to the existing user.
     */
    if (user) {
      user.googleId = googleId;
      user.authProvider = "google";
      user.isVerified = true;

      await user.save();
    } else {
      /*
       * Create a new Google user.
       */
      user = await User.create({
        fullName: fullName || "Google User",
        email,
        authProvider: "google",
        googleId,
        isVerified: true,
      });
    }
  }

  /*
   * Generate application access token.
   */
  const accessToken = generateAccessToken(user._id);

  /*
   * Generate and store refresh token.
   */
  const refreshToken = await createRefreshToken(user._id);

  /*
   * Store refresh token in HttpOnly cookie.
   */
  setRefreshTokenCookie(res, refreshToken);

  /*
   * Return application authentication data.
   */
  return res.status(200).json({
    success: true,
    message: "Google login successful.",
    accessToken,
    user: getUserResponse(user),
  });
});

/**
 * @route POST /api/auth/refresh
 * @access Public
 *
 * Generate a new access token using the refresh token
 * stored inside the HttpOnly cookie.
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  /*
   * Refresh token cookie is required.
   */
  if (!refreshToken) {
    throw new apiError(401, "Refresh token not found.");
  }

  /*
   * Hash incoming refresh token.
   */
  const refreshTokenHash = hashRefreshToken(refreshToken);

  /*
   * Find user using stored refresh token hash
   * and make sure the refresh token has not expired.
   */
  const user = await User.findOne({
    refreshTokenHash,
    refreshTokenExpiresAt: {
      $gt: new Date(),
    },
  });

  /*
   * Token is invalid, expired, or revoked.
   */
  if (!user) {
    clearRefreshTokenCookie(res);

    throw new apiError(401, "Invalid or expired refresh token.");
  }

  /*
   * Verify refresh JWT.
   */
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    /*
     * Make sure the token belongs to the same user.
     */
    if (decoded.id !== user._id.toString()) {
      throw new Error("Invalid refresh token.");
    }

    /*
     * Make sure this JWT is actually a refresh token.
     */
    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type.");
    }
  } catch (error) {
    /*
     * Revoke invalid refresh token.
     */
    user.refreshTokenHash = null;
    user.refreshTokenExpiresAt = null;

    await user.save();

    clearRefreshTokenCookie(res);

    throw new apiError(401, "Invalid or expired refresh token.");
  }

  /*
   * Generate a new short-lived access token.
   */
  const accessToken = generateAccessToken(user._id);

  /*
   * Rotate refresh token.
   *
   * The old refresh token becomes invalid.
   */
  const newRefreshToken = await createRefreshToken(user._id);

  /*
   * Send new refresh token as HttpOnly cookie.
   */
  setRefreshTokenCookie(res, newRefreshToken);

  /*
   * Return new access token.
   */
  return res.status(200).json({
    success: true,
    message: "Access token refreshed successfully.",
    accessToken,
    user: getUserResponse(user),
  });
});

/**
 * @route POST /api/auth/logout
 * @access Public
 *
 * Revoke refresh token and remove its cookie.
 */
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  /*
   * Revoke refresh token if it exists.
   */
  if (refreshToken) {
    const refreshTokenHash = hashRefreshToken(refreshToken);

    await User.findOneAndUpdate(
      {
        refreshTokenHash,
      },
      {
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    );
  }

  /*
   * Remove refresh token cookie.
   */
  clearRefreshTokenCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

/**
 * @route POST /api/auth/forgot-password
 * @access Public
 *
 * Send password reset email.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  /*
   * Validation
   */
  if (!email) {
    throw new apiError(400, "Email is required.");
  }

  /*
   * Find user.
   */
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  console.log("user", user);

  /*
   * Always return the same response if the
   * account does not exist.
   *
   * This prevents email enumeration.
   */
  if (!user) {
    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  }

  /*
   * Google users do not have a local password.
   */
  if (user.authProvider === "google") {
    return res.status(200).json({
      success: true,
      message:
        "This account uses Google Sign-In. Password reset is not available. Please continue with Google.",
      authProvider: "google",
    });
  }

  /*
   * Generate cryptographically secure random token.
   *
   * This raw token is sent to the user.
   */
  const resetToken = crypto.randomBytes(32).toString("hex");

  /*
   * Store only the hash in MongoDB.
   */
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  /*
   * Reset token expires after 15 minutes.
   */
  const resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  /*
   * Save hashed token and expiry.
   */
  user.resetPasswordTokenHash = resetTokenHash;
  user.resetPasswordExpiresAt = resetPasswordExpiresAt;

  await user.save();

  /*
   * Create frontend reset URL.
   */
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  /*
   * Send reset email.
   */
  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Your ResumeAI Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          
          <h2 style="color: #2563eb;">
            Reset Your Password
          </h2>

          <p>
            Hello ${user.fullName},
          </p>

          <p>
            We received a request to reset your ResumeAI account password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                background: #2563eb;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            ResumeAI Team
          </p>

        </div>
      `,
    });
  } catch (error) {
    /*
     * Do not leave a valid reset token behind
     * if email delivery fails.
     */
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;

    await user.save();

    console.error("Password Reset Email Error:", error);

    throw new apiError(
      500,
      "Unable to send password reset email. Please try again later.",
    );
  }

  return res.status(200).json({
    success: true,
    message:
      "If an account exists with this email, a password reset link has been sent.",
  });
});

/**
 * @route POST /api/auth/reset-password/:token
 * @access Public
 *
 * Reset user password using a valid reset token.
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  /*
   * Validation
   */
  if (!token) {
    throw new apiError(400, "Reset token is required.");
  }

  if (!password) {
    throw new apiError(400, "New password is required.");
  }

  if (password.length < 6) {
    throw new apiError(400, "Password must be at least 6 characters long.");
  }

  /*
   * Hash token received from frontend.
   */
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  /*
   * Find user with valid, non-expired token.
   */
  const user = await User.findOne({
    resetPasswordTokenHash: resetTokenHash,
    resetPasswordExpiresAt: {
      $gt: new Date(),
    },
  });

  /*
   * Invalid or expired token.
   */
  if (!user) {
    throw new apiError(400, "Password reset link is invalid or has expired.");
  }

  /*
   * Hash new password.
   */
  const hashedPassword = await bcrypt.hash(password, 10);

  /*
   * Update password.
   */
  user.password = hashedPassword;

  /*
   * Clear reset token immediately.
   *
   * This makes the reset link one-time use.
   */
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;

  /*
   * Save updated user.
   */

  /*
   * Revoke existing refresh token.
   *
   * This logs the user out from existing sessions
   * after changing the password.
   */
  user.refreshTokenHash = null;
  user.refreshTokenExpiresAt = null;

  await user.save();

  /*
   * Remove refresh cookie.
   */
  clearRefreshTokenCookie(res);

  return res.status(200).json({
    success: true,
    message: "Password reset successful. Please login with your new password.",
  });
});
