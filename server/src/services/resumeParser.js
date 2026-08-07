import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import apiError from "../utils/apiError.js";

export const extractResumeText = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".pdf": {
      const buffer = await fs.readFile(filePath);

      const data = await pdfParse(buffer);

      return data.text;
    }

    case ".docx": {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      return result.value;
    }

    default:
      throw new apiError("Unsupported file format.", 400);
  }
};
