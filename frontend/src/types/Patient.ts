export interface Patient {
  patientId?: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  authUserId?: string;
}
