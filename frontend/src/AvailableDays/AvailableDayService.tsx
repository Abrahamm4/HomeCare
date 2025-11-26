import type { AvailableDay, AvailableDayInput } from "../types/AvailableDay";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (response.ok) {
    if (response.status === 204) {
      return null; // No content
    }
    return response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || "Network response was not ok");
  }
};

// ----------- GET ALL -----------
export const fetchAvailableDays = async (): Promise<AvailableDay[]> => {
  const response = await fetch(`${API_URL}/api/AvailableDays`);
  return handleResponse(response);
};

// ----------- GET BY ID -----------
export const fetchAvailableDayById = async (
  availableDayId: number
): Promise<AvailableDay> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/${availableDayId}`);
  return handleResponse(response);
};

// ----------- GET BY DATE -----------
export const fetchAvailableDaysByDate = async (
  date: string
): Promise<AvailableDay[]> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/by-date?date=${date}`);
  return handleResponse(response);
};

// ----------- GET BY PERSONNEL -----------
export const fetchAvailableDaysByPersonnel = async (
  personnelId: number
): Promise<AvailableDay[]> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/by-personnel/${personnelId}`);
  return handleResponse(response);
};

// ----------- CREATE -----------
export const createAvailableDay = async (
  availableDay: AvailableDayInput
): Promise<AvailableDay> => {
  const response = await fetch(`${API_URL}/api/AvailableDays`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(availableDay),
  });
  return handleResponse(response);
};

// ----------- UPDATE -----------
export const updateAvailableDay = async (
  availableDayId: number,
  availableDay: AvailableDayInput
): Promise<AvailableDay | null> => {
  const response = await fetch(`${API_URL}/api/AvailableDays/${availableDayId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(availableDay),
  });
  return handleResponse(response);
};

// ----------- DELETE -----------
export const deleteAvailableDay = async (availableDayId: number) => {
  const response = await fetch(`${API_URL}/api/AvailableDays/${availableDayId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
