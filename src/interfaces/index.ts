export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IBloodRequest {
  id: number;
  recipient_id: number;
  title: string;
  description: string;
  blood_group: string;
  units_required: number;
  status: string;
  urgency: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  proofs_url: string[];
}
