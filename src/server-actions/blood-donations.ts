"use server";

import { db } from "@/config/db";
import { IBloodDonation } from "@/interfaces";

export const createBloodDonation = async (payload: Partial<IBloodDonation>) => {
  try {
    const status = payload.status || "pending";

    const result = await db.query(
      `INSERT INTO blood_donations
        (donor_id, request_id, blood_group, units_available, availability_date, contact_phone, contact_email, address, medical_info, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        payload.donor_id,
        payload.request_id || null,
        payload.blood_group,
        payload.units_available,
        payload.availability_date,
        payload.contact_phone,
        payload.contact_email,
        payload.address,
        payload.medical_info || null,
        payload.notes || null,
        status,
      ]
    );

    const data = result.rows[0];

    if (!data) {
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
    const result = await db.query(
      "SELECT * FROM blood_donations WHERE donor_id = $1 ORDER BY created_at DESC",
      [donorId]
    );

    return {
      success: true,
      data: result.rows || [],
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
    const result = await db.query(
      "SELECT * FROM blood_donations WHERE id = $1",
      [id]
    );

    const data = result.rows[0];

    if (!data) {
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
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    const fields: (keyof IBloodDonation)[] = [
      "blood_group",
      "units_available",
      "availability_date",
      "contact_phone",
      "contact_email",
      "address",
      "medical_info",
      "notes",
      "status",
    ];

    for (const field of fields) {
      if (payload[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex++}`);
        values.push(payload[field]);
      }
    }

    if (setClauses.length === 0) {
      return { success: false, message: "No fields to update" };
    }

    values.push(id);
    const result = await db.query(
      `UPDATE blood_donations SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    const data = result.rows[0];

    if (!data) {
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
    await db.query("DELETE FROM blood_donations WHERE id = $1", [id]);

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
    const result = await db.query(
      `SELECT bd.*, json_build_object('id', up.id, 'name', up.name, 'email', up.email) AS donor
       FROM blood_donations bd
       LEFT JOIN user_profiles up ON bd.donor_id = up.id
       WHERE bd.status = 'approved'
       ORDER BY bd.created_at DESC`
    );

    return {
      success: true,
      data: result.rows || [],
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
    const result = await db.query(
      `SELECT bd.*, json_build_object('id', up.id, 'name', up.name, 'email', up.email) AS donor
       FROM blood_donations bd
       LEFT JOIN user_profiles up ON bd.donor_id = up.id
       ORDER BY bd.created_at DESC`
    );

    return {
      success: true,
      data: result.rows || [],
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
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (payload.status !== undefined) {
      setClauses.push(`status = $${paramIndex++}`);
      values.push(payload.status);
    }

    if (setClauses.length === 0) {
      return { success: false, message: "No fields to update" };
    }

    values.push(id);
    const result = await db.query(
      `UPDATE blood_donations SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    const data = result.rows[0];

    if (!data) {
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

export const getDonationsForRequest = async (requestId: number) => {
  try {
    const result = await db.query(
      `SELECT bd.*, json_build_object('id', up.id, 'name', up.name, 'email', up.email, 'role', up.role) AS donor
       FROM blood_donations bd
       LEFT JOIN user_profiles up ON bd.donor_id = up.id
       WHERE bd.request_id = $1
       ORDER BY bd.created_at DESC`,
      [requestId]
    );

    return {
      success: true,
      data: result.rows || [],
      message: "Donations retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve donations for this request",
    };
  }
};
