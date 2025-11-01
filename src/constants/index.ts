export const USER_ROLES = [
  { label: "Admin", value: "admin" },
  { label: "Donor", value: "donor" },
  { label: "Recipient", value: "recipient" },
] as const;

export type UserRole = (typeof USER_ROLES)[number]["value"];
