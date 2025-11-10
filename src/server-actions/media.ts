"use server";

import supabase from "@/config/supabase-config";

interface FileData {
  buffer: string; // base64 encoded
  fileName: string;
  fileType: string;
}

export const uploadMedia = async (
  fileData: FileData,
  relatedType: string,
  relatedId: number
) => {
  try {
    // Convert base64 back to buffer
    const buffer = Buffer.from(fileData.buffer, "base64");

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}-${fileData.fileName.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const filePath = `${relatedType}/${relatedId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, buffer, {
        contentType: fileData.fileType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError || !uploadData) {
      console.error("Upload error:", uploadError);
      return {
        success: false,
        message: "Media upload failed",
        error: uploadError?.message,
      };
    }

    // Get public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from("media")
      .getPublicUrl(uploadData.path);

    if (!urlData?.publicUrl) {
      return {
        success: false,
        message: "Failed to retrieve media URL",
      };
    }

    // Insert media record into the database
    const { data, error: dbError } = await supabase
      .from("media")
      .insert([
        {
          url: urlData.publicUrl,
          related_id: relatedId,
          related_type: relatedType,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return {
        success: false,
        message: "Failed to save media record",
        error: dbError.message,
      };
    }

    return {
      success: true,
      message: "Media uploaded successfully",
      data: {
        ...data,
        url: urlData.publicUrl,
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
    // Get media record to find the file path
    const { data: media, error: fetchError } = await supabase
      .from("media")
      .select("*")
      .eq("id", mediaId)
      .single();

    if (fetchError || !media) {
      return {
        success: false,
        message: "Media not found",
      };
    }

    // Extract file path from URL
    const url = new URL(media.url);
    const pathParts = url.pathname.split("/media/");
    const filePath = pathParts[1];

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("media")
      .remove([filePath]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("media")
      .delete()
      .eq("id", mediaId);

    if (dbError) {
      return {
        success: false,
        message: "Failed to delete media record",
      };
    }

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
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .eq("related_type", relatedType)
      .eq("related_id", relatedId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Failed to retrieve media",
      };
    }

    return {
      success: true,
      data: data || [],
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
