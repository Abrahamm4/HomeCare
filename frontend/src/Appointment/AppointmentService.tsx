import type { Appointment, AppointmentInput } from "../types/Appointment";

const API_URL = import.meta.env.VITE_API_URL;

// Add Authorization headers if token exists
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Unified response handler
const handleResponse = async (response: Response) => {
  if (response.ok) {
    if (response.status === 204) return null; // No content
    return response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || "Network response was not ok");
  }
};

// ----------- GET ALL -----------
export const fetchAppointments = async (): Promise<Appointment[]> => {
  const response = await fetch(`${API_URL}/api/Appointments`, { headers: getAuthHeaders() });
  return handleResponse(response);
};

// ----------- GET BY ID -----------
export const fetchAppointmentById = async (appointmentId: number): Promise<Appointment> => {
  const response = await fetch(`${API_URL}/api/Appointments/${appointmentId}`, { headers: getAuthHeaders() });
  return handleResponse(response);
};

// ----------- CREATE -----------
export const createAppointment = async (input: AppointmentInput): Promise<Appointment> => {
  const response = await fetch(`${API_URL}/api/Appointments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });
  return handleResponse(response);
};

// ----------- UPDATE -----------
export const updateAppointment = async (
  appointmentId: number,
  input: AppointmentInput
): Promise<Appointment | null> => {

  if (!input.personnelId || !input.date) {
    throw new Error("personnelId and date must be provided for update");
  }

  const payload = {
    appointmentId,
    date: input.date,
    notes: input.notes ?? "",
    patientId: input.patientId,
    personnelId: input.personnelId,
    availableDayId: input.availableDayId,
  };

  const response = await fetch(`${API_URL}/api/Appointments/${appointmentId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// ----------- DELETE -----------
export const deleteAppointment = async (appointmentId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/Appointments/${appointmentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
