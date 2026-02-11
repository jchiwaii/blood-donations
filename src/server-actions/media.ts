"use server";

import { db } from "@/config/db";
import path from "path";
import fs from "fs/promises";

interface FileData {
  buffer: string; // base64 encoded
  fileName: string;
  fileType: string;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir(subDir: string) {
  const dir = path.join(UPLOAD_DIR, subDir);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export const uploadMedia = async (
  fileData: FileData,
  relatedType: string,
  relatedId: number
) => {
  try {
    const buffer = Buffer.from(fileData.buffer, "base64");

    const timestamp = Date.now();
    const safeName = fileData.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${safeName}`;
    const subDir = `${relatedType}/${relatedId}`;
    const dir = await ensureUploadDir(subDir);
    const filePath = path.join(dir, fileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subDir}/${fileName}`;

    const result = await db.query(
      "INSERT INTO media (url, related_id, related_type) VALUES ($1, $2, $3) RETURNING *",
      [publicUrl, relatedId, relatedType]
    );

    const data = result.rows[0];

    if (!data) {
      return {
        success: false,
        message: "Failed to save media record",
      };
    }

    return {
      success: true,
      message: "Media uploaded successfully",
      data: {
        ...data,
        url: publicUrl,
      },
    };
  } catch (error: any) {
    console.error("Upload exception:", error);
    return {
      success: false,
      message: "Media upload failed",
      error: error.message,
    };
  }
};

export const uploadMultipleMedia = async (
  filesData: FileData[],
  relatedType: string,
  relatedId: number
) => {
  try {
    const results = await Promise.all(
      filesData.map((fileData) => uploadMedia(fileData, relatedType, relatedId))
    );

    const successfulUploads = results.filter((r) => r.success);
    const failedUploads = results.filter((r) => !r.success);

    if (failedUploads.length > 0) {
      console.error("Some uploads failed:", failedUploads);
    }

    return {
      success: successfulUploads.length > 0,
      message:
        successfulUploads.length === filesData.length
          ? "All files uploaded successfully"
          : `${successfulUploads.length} of ${filesData.length} files uploaded`,
      data: successfulUploads.map((r) => r.data),
      urls: successfulUploads.map((r) => r.data?.url).filter(Boolean),
      errors: failedUploads.length > 0 ? failedUploads : undefined,
    };
  } catch (error: any) {
    console.error("Multiple upload exception:", error);
    return {
      success: false,
      message: "Failed to upload files",
      error: error.message,
    };
  }
};

export const deleteMedia = async (mediaId: number) => {
  try {
    const mediaResult = await db.query(
      "SELECT * FROM media WHERE id = $1",
      [mediaId]
    );

    const media = mediaResult.rows[0];

    if (!media) {
      return {
        success: false,
        message: "Media not found",
      };
    }

    // Try to delete the file from disk
    try {
      const filePath = path.join(process.cwd(), "public", media.url);
      await fs.unlink(filePath);
    } catch {
      console.error("File not found on disk, continuing with DB cleanup");
    }

    await db.query("DELETE FROM media WHERE id = $1", [mediaId]);

    return {
      success: true,
      message: "Media deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete exception:", error);
    return {
      success: false,
      message: "Media deletion failed",
      error: error.message,
    };
  }
};

export const getMediaByRelated = async (
  relatedType: string,
  relatedId: number
) => {
  try {
    const result = await db.query(
      "SELECT * FROM media WHERE related_type = $1 AND related_id = $2 ORDER BY created_at DESC",
      [relatedType, relatedId]
    );

    return {
      success: true,
      data: result.rows || [],
      message: "Media retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to retrieve media",
      error: error.message,
    };
  }
};
