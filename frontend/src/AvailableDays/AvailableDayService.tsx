// src/components/AvailableDayService.ts
import type { AvailableDay, AvailableDayInput } from "../types/AvailableDay";
import type { Personnel } from "../types/Personnel";
import * as PersonnelService from "../Personnel/PersonnelService";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async (response: Response) => {
  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || "Network response was not ok");
  }
};

// Helper to attach personnel info
const enrichWithPersonnel = async (days: AvailableDay[]): Promise<AvailableDay[]> => {
  const personnels = await PersonnelService.fetchPersonnels();
  return days.map(day => {
    const personnel = personnels.find(p => p.id === day.personnelId);
    return { ...day, personnel };
  });
};

// ----------- GET ALL -----------
export const fetchAvailableDays = async (): Promise<AvailableDay[]> => {
  const response = await fetch(`${API_URL}/api/AvailableDays`, { headers: getAuthHeaders() });
  const days: AvailableDay[] = await handleResponse(response);
  return enrichWithPersonnel(days);
};

// ----------- GET BY ID -----------
export const fetchAvailableDayById = async (availableDayId: number): Promise<AvailableDay> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/${availableDayId}`, { headers: getAuthHeaders() });
  const day: AvailableDay = await handleResponse(response);
  const personnels = await PersonnelService.fetchPersonnels();
  const personnel = personnels.find(p => p.id === day.personnelId);
  return { ...day, personnel };
};

// ----------- GET BY DATE -----------
export const fetchAvailableDaysByDate = async (date: string): Promise<AvailableDay[]> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/by-date?date=${date}`, { headers: getAuthHeaders() });
  const days: AvailableDay[] = await handleResponse(response);
  return enrichWithPersonnel(days);
};

// ----------- GET BY PERSONNEL -----------
export const fetchAvailableDaysByPersonnel = async (personnelId: number): Promise<AvailableDay[]> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/by-personnel/${personnelId}`, { headers: getAuthHeaders() });
  const days: AvailableDay[] = await handleResponse(response);
  return enrichWithPersonnel(days);
};

// ----------- CREATE -----------
export const createAvailableDay = async (availableDay: AvailableDayInput): Promise<AvailableDay> => {
  const response = await fetch(`${API_URL}/api/AvailableDays`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(availableDay),
  });
  const day: AvailableDay = await handleResponse(response);
  const personnels = await PersonnelService.fetchPersonnels();
  const personnel = personnels.find(p => p.id === day.personnelId);
  return { ...day, personnel };
};

// ----------- UPDATE -----------
export const updateAvailableDay = async (availableDayId: number, availableDay: AvailableDayInput): Promise<AvailableDay | null> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/${availableDayId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(availableDay),
  });
  const day: AvailableDay | null = await handleResponse(response);
  if (!day) return null;
  const personnels = await PersonnelService.fetchPersonnels();
  const personnel = personnels.find(p => p.id === day.personnelId);
  return { ...day, personnel };
};

// ----------- DELETE -----------
export const deleteAvailableDay = async (availableDayId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/${availableDayId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
