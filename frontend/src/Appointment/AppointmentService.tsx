import type { Appointment, AppointmentInput } from "../types/Appointment";
import { getStoredToken } from "../Auth/AuthService";

const API_URL = import.meta.env.VITE_API_URL;

// Auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getStoredToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// handle response to show only detail
const handleResponse = async (response: Response) => {
  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  }

  // Try reading JSON error body
  const errorBody = await response.json().catch(() => null);

  const message =
    errorBody?.detail ||
    errorBody?.errors?.[Object.keys(errorBody?.errors ?? {})[0]]?.[0] ||
    errorBody?.title ||
    "An unexpected error occurred";

  throw new Error(message);
};

// Get all
export const fetchAppointments = async (): Promise<Appointment[]> => {
  const response = await fetch(`${API_URL}/api/Appointments`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Get by ID
export const fetchAppointmentById = async (
  appointmentId: number
): Promise<Appointment> => {
  const response = await fetch(
    `${API_URL}/api/Appointments/${appointmentId}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse(response);
};

// Create
export const createAppointment = async (
  input: AppointmentInput
): Promise<Appointment> => {
  const response = await fetch(`${API_URL}/api/Appointments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });

  return handleResponse(response);
};

// Update
export const updateAppointment = async (
  appointmentId: number,
  input: AppointmentInput
): Promise<Appointment | null> => {
  const response = await fetch(
    `${API_URL}/api/Appointments/${appointmentId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    }
  );

  return handleResponse(response);
};

// Delete
export const deleteAppointment = async (
  appointmentId: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/api/Appointments/${appointmentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};
