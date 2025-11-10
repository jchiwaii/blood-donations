"use server";

import supabase from "@/config/supabase-config";
import { IBloodDonation } from "@/interfaces";

export const createBloodDonation = async (payload: Partial<IBloodDonation>) => {
  try {
    // Set default status if not provided
    const donationData = {
      ...payload,
      status: payload.status || "available",
    };

    const { data, error } = await supabase
      .from("blood_donations")
      .insert([donationData])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: "Failed to create donation response",
      };
    }

    return {
      success: true,
      message: "Donation response created successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create donation response",
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

export const getAllAvailableDonations = async () => {
  try {
    const { data, error } = await supabase
      .from("blood_donations")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Failed to retrieve available donations",
      };
    }

    return {
      success: true,
      data: data || [],
      message: "Available donations retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve available donations",
    };
  }
};
