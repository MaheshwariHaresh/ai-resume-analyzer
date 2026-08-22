import express from "express";

import {
  register,
  login,
  refreshAccessToken,
  logout,
  googleLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

/*
 * Public Authentication Routes
 */

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Refresh Access Token
router.post("/refresh", refreshAccessToken);

// Logout
router.post("/logout", logout);

// Google Login
router.post("/google", googleLogin);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);

export default router;
