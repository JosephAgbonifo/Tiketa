// middlewares/uploadImage.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import { UploadApiResponse } from "cloudinary";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export async function uploadImageMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Convert buffer to base64
    const fileBase64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${fileBase64}`;

    const result: UploadApiResponse = await cloudinary.uploader.upload(
      dataURI,
      {
        folder: "uploads", // optional folder in Cloudinary
        resource_type: "image",
      }
    );

    // Attach Cloudinary URL to request
    (req as any).file = result.secure_url;

    next();
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return res.status(500).json({ message: "Image upload failed" });
  }
}
