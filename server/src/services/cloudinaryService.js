import cloudinary from "../config/cloudinary.js";

export const uploadResumeToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "AI-Resume-Analyzer/Resumes",
    use_filename: true,
    unique_filename: true,
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
  };
};

export const deleteResumeFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};
