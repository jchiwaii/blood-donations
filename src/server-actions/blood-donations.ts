"use server";

import supabase from "@/config/supabase-config";
import { IBloodDonation } from "@/interfaces";

export const createBloodDonation = async (payload: Partial<IBloodDonation>) => {
  try {
    // Set default status to pending for admin approval
    const donationData = {
      ...payload,
      status: payload.status || "pending",
    };

    const { data, error } = await supabase
      .from("blood_donations")
      .insert([donationData])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: "Failed to create donation offer",
      };
    }

    return {
      success: true,
      message: "Donation offer created successfully and pending admin approval",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create donation offer",
    };
  }
};

export const getBloodDonations = async (donorId: number) => {
  try {
    const { data, error } = await supabase
      .from("blood_donations")
      .select("*")
      .eq("donor_id", donorId)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Failed to retrieve donations",
      };
    }

    return {
      success: true,
      data: data || [],
      message: "Donations retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve donations",
    };
  }
};

export const getBloodDonationById = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("blood_donations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return {
        success: false,
        message: "Failed to retrieve donation",
      };
    }

    return {
      success: true,
      data,
      message: "Donation retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve donation",
    };
  }
};

export const updateBloodDonation = async (
  id: number,
  payload: Partial<IBloodDonation>
) => {
  try {
    const { data, error } = await supabase
      .from("blood_donations")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: "Failed to update donation",
      };
    }

    return {
      success: true,
      message: "Donation updated successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update donation",
    };
  }
};

export const deleteBloodDonation = async (id: number) => {
  try {
    const { error } = await supabase
      .from("blood_donations")
      .delete()
      .eq("id", id);

    if (error) {
      return {
        success: false,
        message: "Failed to delete donation",
      };
    }

    return {
      success: true,
      message: "Donation deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete donation",
    };
  }
};

export const getApprovedDonations = async () => {
  try {
    const { data, error } = await supabase
      .from("blood_donations")
      .select("*, donor:user_profiles!blood_donations_donor_id_fkey(id, name, email)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Failed to retrieve approved donations",
      };
    }

    return {
      success: true,
      data: data || [],
      message: "Approved donations retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve approved donations",
    };
  }
};

export const getAllBloodDonationsForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from("blood_donations")
      .select("*, donor:user_profiles!blood_donations_donor_id_fkey(id, name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Failed to retrieve donations",
      };
    }

    return {
      success: true,
      data: data || [],
      message: "Donations retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve donations",
    };
  }
};

export const updateBloodDonationStatus = async (
  id: number,
  payload: Partial<IBloodDonation>
) => {
  try {
    const { data, error } = await supabase
      .from("blood_donations")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: "Failed to update donation status",
      };
    }

    return {
      success: true,
      message: "Donation status updated successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update donation status",
    };
  }
};
