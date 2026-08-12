import { Router } from "express";

import {
  changePassword,
  deleteAccount,
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Get logged-in user's profile
router.get("/profile", getMyProfile);

// Update logged-in user's profile
router.put("/profile", updateMyProfile);

router.patch("/change-password", changePassword);

router.delete("/account", deleteAccount);

export default router;
