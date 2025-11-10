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
  proofs_url?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface IBloodDonation {
  id: number;
  donor_id: number;
  request_id?: number;
  blood_group: string;
  units_available: number;
  availability_date: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  medical_info?: string;
  notes?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface IMedia {
  id: number;
  url: string;
  related_id: number;
  related_type: string;
  created_at?: string;
}
