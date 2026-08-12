import User from "../models/User.js";
import Resume from "../models/Resume.js";
import InterviewSession from "../models/InterviewSession.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

import apiError from "../utils/apiError.js";

/**
 * @desc Get logged-in user's profile
 * @route GET /api/users/profile
 * @access Private
 */

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new apiError("User not found.", 404);
  }

  // Resume Statistics
  const resumes = await Resume.find({
    user: req.user._id,
  }).select("analysis.atsScore");

  const resumeCount = resumes.length;

  const totalATS = resumes.reduce(
    (total, resume) => total + (resume.analysis?.atsScore || 0),
    0,
  );

  const averageATS = resumeCount > 0 ? Math.round(totalATS / resumeCount) : 0;

  // Interview Statistics
  const interviewCount = await InterviewSession.countDocuments({
    user: req.user._id,
  });

  return res.status(200).json({
    success: true,
    data: {
      user,
      statistics: {
        resumeAnalyses: resumeCount,
        averageATS,
        interviewSessions: interviewCount,
        memberSince: user.createdAt,
      },
    },
  });
});

/**
 * @desc Update logged-in user's profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateMyProfile = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    profession,
    location,
    experience,
    linkedin,
    github,
    portfolio,
  } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new apiError("User not found.", 404);
  }

  // Update only provided fields
  if (fullName !== undefined) user.fullName = fullName;
  if (phone !== undefined) user.phone = phone;
  if (profession !== undefined) user.profession = profession;
  if (location !== undefined) user.location = location;
  if (experience !== undefined) user.experience = experience;
  if (linkedin !== undefined) user.linkedin = linkedin;
  if (github !== undefined) user.github = github;
  if (portfolio !== undefined) user.portfolio = portfolio;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: user,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    throw new apiError(400, "Current password and new password are required.");
  }

  if (newPassword.length < 6) {
    throw new apiError(400, "New password must be at least 6 characters long.");
  }

  // Find logged-in user
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new apiError(404, "User not found.");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new apiError(401, "Current password is incorrect.");
  }

  // Prevent same password
  if (currentPassword === newPassword) {
    throw new apiError(
      400,
      "New password must be different from current password.",
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  user.password = hashedPassword;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully.",
  });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new apiError(404, "User not found.");
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Account deleted successfully.",
  });
});
