"use server";

import supabase from "@/config/supabase-config";
import { IUser } from "@/interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const registerUser = async (payload: Partial<IUser>) => {
  try {
    // Validate required fields
    if (!payload.email || !payload.password || !payload.name || !payload.role) {
      return {
        success: false,
        message: "Registration failed",
      };
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", payload.email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return {
        success: false,
        message: "Registration failed",
      };
    }

    if (existingUser) {
      return {
        success: false,
        message: "Registration failed",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    // Insert new user into the database
    const { data, error: insertError } = await supabase
      .from("user_profiles")
      .insert([
        {
          name: payload.name,
          email: payload.email,
          password: hashedPassword,
          role: payload.role,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return {
        success: false,
        message: "Registration failed",
      };
    }

    // Create token for auto-login
    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name,
      },
      process.env.JWT_SECRET || "qwdweryrty",
      { expiresIn: "7d" }
    );

    return {
      success: true,
      message: "User registered successfully",
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        token,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Registration failed",
    };
  }
};

export const loginUser = async (payload: {
  email: string;
  password: string;
  role: string;
}) => {
  try {
    // Validate required fields
    if (!payload.email || !payload.password || !payload.role) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    // Fetch user from database
    const { data: user, error: fetchError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", payload.email)
      .single();

    if (fetchError || !user) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    // Verify role matches
    if (user.role !== payload.role) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    return {
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Login failed",
    };
  }
};

export const currentUser = async (token?: string) => {
  try {
    const cookiesStore = await cookies();
    const tokenFromCookie = cookiesStore.get("auth_token")?.value;
    const authToken = token || tokenFromCookie;

    if (!authToken) {
      return null;
    }

    // Verify and decode the token
    const decoded: any = jwt.verify(
      authToken,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Fetch user from database
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, name, email, role")
      .eq("id", decoded.id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
  } catch (error: any) {
    return null;
  }
};

export const getUsersStatistics = async () => {
  try {
    // Get total users by role
    const { data: donors, error: donorsError } = await supabase
      .from("user_profiles")
      .select("id", { count: "exact" })
      .eq("role", "donor");

    const { data: recipients, error: recipientsError } = await supabase
      .from("user_profiles")
      .select("id", { count: "exact" })
      .eq("role", "recipient");

    const { data: admins, error: adminsError } = await supabase
      .from("user_profiles")
      .select("id", { count: "exact" })
      .eq("role", "admin");

    // Get blood donation statistics
    const { data: donations, error: donationsError } = await supabase
      .from("blood_donations")
      .select("id", { count: "exact" });

    // Get blood request statistics
    const { data: requests, error: requestsError } = await supabase
      .from("blood_requests")
      .select("id", { count: "exact" });

    const { data: pendingRequests, error: pendingError } = await supabase
      .from("blood_requests")
      .select("id", { count: "exact" })
      .eq("status", "pending");

    const { data: approvedRequests, error: approvedError } = await supabase
      .from("blood_requests")
      .select("id", { count: "exact" })
      .eq("status", "approved");

    const { data: rejectedRequests, error: rejectedError } = await supabase
      .from("blood_requests")
      .select("id", { count: "exact" })
      .eq("status", "rejected");

    if (
      donorsError ||
      recipientsError ||
      adminsError ||
      donationsError ||
      requestsError ||
      pendingError ||
      approvedError ||
      rejectedError
    ) {
      return {
        success: false,
        message: "Failed to retrieve statistics",
      };
    }

    return {
      success: true,
      data: {
        totalDonors: donors?.length ?? 0,
        totalRecipients: recipients?.length ?? 0,
        totalAdmins: admins?.length ?? 0,
        totalDonations: donations?.length ?? 0,
        totalRequests: requests?.length ?? 0,
        pendingRequests: pendingRequests?.length ?? 0,
        approvedRequests: approvedRequests?.length ?? 0,
        rejectedRequests: rejectedRequests?.length ?? 0,
      },
      message: "Statistics retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to retrieve statistics",
    };
  }
};

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, name, email, role, created_at")
      .in("role", ["donor", "recipient"])
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        message: "Failed to retrieve users",
      };
    }

    return {
      success: true,
      data: data ?? [],
      message: "Users retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to retrieve users",
    };
  }
};
