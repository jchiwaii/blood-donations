"use server";

import { db } from "@/config/db";
import { IBloodRequest } from "@/interfaces";

export const createBloodRequest = async (payload: Partial<IBloodRequest>) => {
  try {
    console.log("Creating blood request with payload:", payload);

    const result = await db.query(
      `INSERT INTO blood_requests
        (recipient_id, title, description, blood_group, units_required, status, urgency, contact_phone, contact_email, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        payload.recipient_id,
        payload.title,
        payload.description,
        payload.blood_group,
        payload.units_required,
        payload.status || "pending",
        payload.urgency,
        payload.contact_phone,
        payload.contact_email,
        payload.address,
      ]
    );

    const data = result.rows[0];

    if (!data) {
      return {
        success: false,
        message: "Failed to create blood request",
        error: "No data returned",
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
  try {
    const result = await db.query(
      "SELECT * FROM blood_requests WHERE recipient_id = $1 ORDER BY created_at DESC",
      [id]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "No blood requests found",
      };
    }

    return {
      success: true,
      data: result.rows[0],
      message: "Blood requests retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to retrieve blood requests",
    };
  }
};

export const getAllBloodRequests = async (userId: number) => {
  try {
    const result = await db.query(
      "SELECT * FROM blood_requests WHERE recipient_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return {
      success: true,
      data: result.rows ?? [],
      message: "Blood requests retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to retrieve blood requests",
    };
  }
};

export const getApprovedBloodRequests = async () => {
  try {
    const result = await db.query(
      `SELECT br.*, json_build_object('id', up.id, 'name', up.name) AS recipient
       FROM blood_requests br
       LEFT JOIN user_profiles up ON br.recipient_id = up.id
       WHERE br.status = 'approved'
       ORDER BY br.created_at DESC`
    );

    return {
      success: true,
      data: result.rows ?? [],
      message: "Blood requests retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to retrieve blood requests",
    };
  }
};

export const updateBloodRequestStatus = async (
  id: number,
  payload: Partial<IBloodRequest>
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
      `UPDATE blood_requests SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    const data = result.rows[0];

    if (!data) {
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
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to update blood request status",
    };
  }
};

export const updateBloodRequest = async (
  id: number,
  payload: Partial<IBloodRequest>
) => {
  try {
    const existingResult = await db.query(
      "SELECT status FROM blood_requests WHERE id = $1",
      [id]
    );

    const existingRequest = existingResult.rows[0];

    if (!existingRequest) {
      return {
        success: false,
        message: "Failed to update blood request",
      };
    }

    if (existingRequest.status === "approved") {
      return {
        success: false,
        message: "Cannot update approved blood request",
      };
    }

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    const fields: (keyof IBloodRequest)[] = [
      "title",
      "description",
      "blood_group",
      "units_required",
      "urgency",
      "contact_phone",
      "contact_email",
      "address",
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
      `UPDATE blood_requests SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    const data = result.rows[0];

    if (!data) {
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
  try {
    const existingResult = await db.query(
      "SELECT status FROM blood_requests WHERE id = $1",
      [id]
    );

    const existingRequest = existingResult.rows[0];

    if (!existingRequest) {
      return {
        success: false,
        message: "Failed to delete blood request",
      };
    }

    if (existingRequest.status === "approved") {
      return {
        success: false,
        message: "Cannot delete approved blood request",
      };
    }

    await db.query("DELETE FROM blood_requests WHERE id = $1", [id]);

    return {
      success: true,
      message: "Blood request deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete blood request",
    };
  }
};

export const getAllBloodRequestsForAdmin = async () => {
  try {
    const result = await db.query(
      `SELECT br.*, json_build_object('id', up.id, 'name', up.name, 'email', up.email) AS recipient
       FROM blood_requests br
       LEFT JOIN user_profiles up ON br.recipient_id = up.id
       ORDER BY br.created_at DESC`
    );

    return {
      success: true,
      data: result.rows ?? [],
      message: "Blood requests retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to retrieve blood requests",
    };
  }
};
