export const USER_ROLES = [
  { label: "Admin", value: "admin" },
  { label: "Donor", value: "donor" },
  { label: "Recipient", value: "recipient" },
] as const;

export type UserRole = (typeof USER_ROLES)[number]["value"];

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const URGENCY_LEVELS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
] as const;

export const REQUEST_STATUS = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Cancelled", value: "cancelled" },
] as const;
