import express from "express";
const router = express.Router();

import { register, login, getProfile } from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/profile", authMiddleware, getProfile);

export default router;
