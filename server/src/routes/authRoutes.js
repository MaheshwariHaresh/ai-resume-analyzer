import express from "express";

import {
  register,
  login,
  refreshAccessToken,
  logout,
  googleLogin,
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

router.post("/google", googleLogin);
export default router;
