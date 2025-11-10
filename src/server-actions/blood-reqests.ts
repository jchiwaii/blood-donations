"use server";

import supabase from "@/config/supabase-config";

import { IBloodRequest } from "@/interfaces";

export const createBloodRequest = async (payload: Partial<IBloodRequest>) => {
  try {
    console.log("Creating blood request with payload:", payload);

    const { data, error } = await supabase
      .from("blood_requests")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating blood request:", error);
      return {
        success: false,
        message: "Failed to create blood request",
        error: error.message,
      };
    }

    console.log("Blood request created successfully:", data);
    return {
      success: true,
      message: "Blood request created successfully",
      data,
    };
  } catch (error: any) {
    console.error("Exception creating blood request:", error);
    return {
      success: false,
      message: "Failed to create blood request",
      error: error.message,
    };
  }
};

export const getBloodRequests = async (id: number) => {
  const { data, error } = await supabase
    .from("blood_requests")
    .select("*")
    .eq("recipient_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      message: "Failed to retrieve blood requests",
    };
  }

  if (data && data.length === 0) {
    return {
      success: false,
      message: "No blood requests found",
    };
  }

  return {
    success: true,
    data: data[0],
    message: "Blood requests retrieved successfully",
  };
};

export const getAllBloodRequests = async (userId: number) => {
  const { data, error } = await supabase
    .from("blood_requests")
    .select("*")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      message: "Failed to retrieve blood requests",
    };
  }

  return {
    success: true,
    data: data ?? [],
    message: "Blood requests retrieved successfully",
  };
};

export const getApprovedBloodRequests = async () => {
  const { data, error } = await supabase
    .from("blood_requests")
    .select("*, recipient:user_profiles(id, name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      message: "Failed to retrieve blood requests",
    };
  }

  return {
    success: true,
    data: data ?? [],
    message: "Blood requests retrieved successfully",
  };
};

export const updateBloodRequestStatus = async (
  id: number,
  payload: Partial<IBloodRequest>
) => {
  const { data, error } = await supabase
    .from("blood_requests")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      message: "Failed to update blood request status",
    };
  }

  return {
    success: true,
    message: "Blood request status updated successfully",
    data,
  };
};

export const updateBloodRequest = async (
  id: number,
  payload: Partial<IBloodRequest>
) => {
  try {
    const { data, error } = await supabase
      .from("blood_requests")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: "Failed to update blood request",
      };
    }

    return {
      success: true,
      message: "Blood request updated successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update blood request",
    };
  }
};

export const deleteBloodRequest = async (id: number) => {
  const { error } = await supabase.from("blood_requests").delete().eq("id", id);

  if (error) {
    return {
      success: false,
      message: "Failed to delete blood request",
    };
  }

  return {
    success: true,
    message: "Blood request deleted successfully",
  };
};

export const getAllBloodRequestsForAdmin = async () => {
  const { data, error } = await supabase
    .from("blood_requests")
    .select(
      "*, recipient:user_profiles!blood_requests_recipient_id_fkey(id, name, email)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      message: "Failed to retrieve blood requests",
    };
  }

  return {
    success: true,
    data: data ?? [],
    message: "Blood requests retrieved successfully",
  };
};
