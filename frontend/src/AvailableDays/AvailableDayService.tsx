import type { AvailableDay, AvailableDayInput } from "../types/AvailableDay";
import * as PersonnelService from "../Personnel/PersonnelService";
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

// Helpers
const enrichWithPersonnel = async (
  days: AvailableDay[]
): Promise<AvailableDay[]> => {
  const personnels = await PersonnelService.fetchPersonnels();
  return days.map((day) => {
    const personnel = personnels.find((p) => p.id === day.personnelId);
    return { ...day, personnel };
  });
};

// Get all
export const fetchAvailableDays = async (): Promise<AvailableDay[]> => {
  const response = await fetch(`${API_URL}/api/AvailableDays`, {
    headers: getAuthHeaders(),
  });
  const days: AvailableDay[] = await handleResponse(response);
  return enrichWithPersonnel(days);
};

// Get by ID
export const fetchAvailableDayById = async (
  availableDayId: number
): Promise<AvailableDay> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/${availableDayId}`, {
    headers: getAuthHeaders(),
  });
  const day: AvailableDay = await handleResponse(response);

  const personnels = await PersonnelService.fetchPersonnels();
  const personnel = personnels.find((p) => p.id === day.personnelId);

  return { ...day, personnel };
};

// Get by date
export const fetchAvailableDaysByDate = async (
  date: string
): Promise<AvailableDay[]> => {
  const response = await fetch(
    `${API_URL}/api/AvailableDays/by-date?date=${date}`,
    { headers: getAuthHeaders() }
  );
  const days: AvailableDay[] = await handleResponse(response);
  return enrichWithPersonnel(days);
};

// Get by personnel
export const fetchAvailableDaysByPersonnel = async (
  personnelId: number
): Promise<AvailableDay[]> => {
  const response = await fetch(
    `${API_URL}/api/AvailableDays/by-personnel/${personnelId}`,
    { headers: getAuthHeaders() }
  );
  const days: AvailableDay[] = await handleResponse(response);
  return enrichWithPersonnel(days);
};

// Create
export const createAvailableDay = async (
  availableDay: AvailableDayInput
): Promise<AvailableDay> => {
  const response = await fetch(`${API_URL}/api/AvailableDays`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(availableDay),
  });

  const day: AvailableDay = await handleResponse(response);

  const personnels = await PersonnelService.fetchPersonnels();
  const personnel = personnels.find((p) => p.id === day.personnelId);

  return { ...day, personnel };
};

// Update
export const updateAvailableDay = async (
  availableDayId: number,
  availableDay: AvailableDayInput
): Promise<AvailableDay | null> => {
  const response = await fetch(
    `${API_URL}/api/AvailableDays/${availableDayId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(availableDay),
    }
  );

  const day: AvailableDay | null = await handleResponse(response);
  if (!day) return null;

  const personnels = await PersonnelService.fetchPersonnels();
  const personnel = personnels.find((p) => p.id === day.personnelId);

  return { ...day, personnel };
};

// Delete
export const deleteAvailableDay = async (
  availableDayId: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/${availableDayId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};
