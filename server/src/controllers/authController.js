import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/**
 * @route POST /api/auth/register
 * @access Public
 */

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validation
  if (!fullName || !email || !password) {
    throw new apiError(400, "All fields are required.");
  }

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new apiError(409, "Email already registered.");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({
    success: true,
    message: "Registration successful.",
    token: generateToken(user._id),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @route POST /api/auth/login
 * @access Public
 */

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new apiError(400, "Email and password are required.");
  }

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(401, "Invalid email or password.");
  }

  // Compare Password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new apiError(401, "Invalid email or password.");
  }

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    token: generateToken(user._id),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @route GET /api/auth/profile
 * @access Private
 */

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    throw new apiError(404, "User not found.");
  }

  return res.status(200).json({
    success: true,
    user,
  });
});
