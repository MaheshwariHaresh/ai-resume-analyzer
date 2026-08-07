import express from "express";
const router = express.Router();

import { getDashboard } from "../controllers/dashboardController.js";

import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.get("/", getDashboard);

export default router;
