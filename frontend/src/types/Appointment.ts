import type { AvailableDay } from "./AvailableDay";
import type { Patient } from "./Patient";
import type { Personnel } from "./Personnel";

 // Main Appointment type
 
export interface Appointment {
  appointmentId: number;           // consistent with backend
  patientId: number;
  personnelId: number;
  availableDayId: number;
  date: string;                   // ISO string of the appointment date
  notes?: string;

  // Optional navigation properties
  patient?: Patient;
  personnel?: Personnel;
  availableDay?: AvailableDay;
}

// Input for creating/updating an appointment
export interface AppointmentInput {
  patientId: number;
  availableDayId: number;
  notes?: string;
  personnelId?: number;
  date?: string;
}
