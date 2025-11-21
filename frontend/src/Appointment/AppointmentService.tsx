import type { Appointment } from '../types/Appointment';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response: Response) => {
  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  } else {
    const text = await response.text();
    throw new Error(text || 'Network response was not ok');
  }
};

// GET all
export const fetchAppointments = async (): Promise<Appointment[]> => {
  const response = await fetch(`${API_URL}/api/appointments`);
  return handleResponse(response);
};

// GET by ID
export const fetchAppointmentById = async (id: number): Promise<Appointment> => {
  const response = await fetch(`${API_URL}/api/appointments/${id}`);
  return handleResponse(response);
};

// POST
export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  const response = await fetch(`${API_URL}/api/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(appointment),
  });
  return handleResponse(response);
};

// PUT
export const updateAppointment = async (id: number, appointment: Appointment): Promise<Appointment | null> => {
  const response = await fetch(`${API_URL}/api/appointments/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(appointment),
  });
  return handleResponse(response);
};

// DELETE
export const deleteAppointment = async (id: number) => {
  const response = await fetch(`${API_URL}/api/appointments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
