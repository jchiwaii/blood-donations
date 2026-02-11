"use server";

import { db } from "@/config/db";
import { IUser } from "@/interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const registerUser = async (payload: Partial<IUser>) => {
  try {
    if (!payload.email || !payload.password || !payload.name || !payload.role) {
      return {
        success: false,
        message: "Registration failed",
      };
    }

    const existingUserResult = await db.query(
      "SELECT id FROM user_profiles WHERE email = $1 LIMIT 1",
      [payload.email],
    );

    if (existingUserResult.rows.length > 0) {
      return {
        success: false,
        message: "Registration failed",
      };
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const insertResult = await db.query(
      "INSERT INTO user_profiles (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [payload.name, payload.email, hashedPassword, payload.role],
    );

    const data = insertResult.rows[0];

    if (!data) {
      return {
        success: false,
        message: "Registration failed",
      };
    }

    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name,
      },
      process.env.JWT_SECRET || "qwdweryrty",
      { expiresIn: "7d" },
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
    if (!payload.email || !payload.password || !payload.role) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    const userResult = await db.query(
      "SELECT * FROM user_profiles WHERE email = $1 LIMIT 1",
      [payload.email],
    );

    const user = userResult.rows[0];

    if (!user) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    if (user.role !== payload.role) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Login failed",
      };
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
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

    const decoded: any = jwt.verify(
      authToken,
      process.env.JWT_SECRET || "your-secret-key",
    );

    const userResult = await db.query(
      "SELECT id, name, email, role FROM user_profiles WHERE id = $1",
      [decoded.id],
    );

    const data = userResult.rows[0];

    if (!data) {
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
    const [
      donorsResult,
      recipientsResult,
      adminsResult,
      donationsResult,
      requestsResult,
      pendingResult,
      approvedResult,
      rejectedResult,
    ] = await Promise.all([
      db.query(
        "SELECT COUNT(*)::int AS count FROM user_profiles WHERE role = 'donor'",
      ),
      db.query(
        "SELECT COUNT(*)::int AS count FROM user_profiles WHERE role = 'recipient'",
      ),
      db.query(
        "SELECT COUNT(*)::int AS count FROM user_profiles WHERE role = 'admin'",
      ),
      db.query("SELECT COUNT(*)::int AS count FROM blood_donations"),
      db.query("SELECT COUNT(*)::int AS count FROM blood_requests"),
      db.query(
        "SELECT COUNT(*)::int AS count FROM blood_requests WHERE status = 'pending'",
      ),
      db.query(
        "SELECT COUNT(*)::int AS count FROM blood_requests WHERE status = 'approved'",
      ),
      db.query(
        "SELECT COUNT(*)::int AS count FROM blood_requests WHERE status = 'rejected'",
      ),
    ]);

    return {
      success: true,
      data: {
        totalDonors: donorsResult.rows[0]?.count ?? 0,
        totalRecipients: recipientsResult.rows[0]?.count ?? 0,
        totalAdmins: adminsResult.rows[0]?.count ?? 0,
        totalDonations: donationsResult.rows[0]?.count ?? 0,
        totalRequests: requestsResult.rows[0]?.count ?? 0,
        pendingRequests: pendingResult.rows[0]?.count ?? 0,
        approvedRequests: approvedResult.rows[0]?.count ?? 0,
        rejectedRequests: rejectedResult.rows[0]?.count ?? 0,
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
    const result = await db.query(
      "SELECT id, name, email, role, created_at FROM user_profiles WHERE role IN ('donor', 'recipient') ORDER BY created_at DESC",
    );

    return {
      success: true,
      data: result.rows ?? [],
      message: "Users retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to retrieve users",
    };
  }
};
