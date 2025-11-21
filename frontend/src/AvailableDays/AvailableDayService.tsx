import type { AvailableDay } from "../types/AvailableDay";

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
// GET: /AvailableDays
export const fetchAvailableDays = async (): Promise<AvailableDay[]> => {
  const response = await fetch(`${API_URL}/backend/HomeCareApi/AvailableDays`);
  return handleResponse(response);
};

// ----------- GET BY ID -----------
// GET: /AvailableDays/{id}
export const fetchAvailableDayById = async (
  availableDayId: number
): Promise<AvailableDay> => {
  const response = await fetch(
    `${API_URL}/backend/HomeCareApi/AvailableDays/${availableDayId}`
  );
  return handleResponse(response);
};

// ----------- GET BY DATE -----------
// GET: /AvailableDays/by-date?date=YYYY-MM-DD
export const fetchAvailableDaysByDate = async (
  date: string
): Promise<AvailableDay[]> => {
  const response = await fetch(
    `${API_URL}/backend/HomeCareApi/AvailableDays/by-date?date=${date}`
  );
  return handleResponse(response);
};

// ----------- GET BY PERSONNEL -----------
// GET: /AvailableDays/by-personnel/{personnelId}
export const fetchAvailableDaysByPersonnel = async (
  personnelId: number
): Promise<AvailableDay[]> => {
  const response = await fetch(
    `${API_URL}/backend/HomeCareApi/AvailableDays/by-personnel/${personnelId}`
  );
  return handleResponse(response);
};

// ----------- CREATE -----------
// POST: /AvailableDays
export const createAvailableDay = async (
  availableDay: AvailableDay
): Promise<AvailableDay> => {
  const response = await fetch(
    `${API_URL}/backend/HomeCareApi/AvailableDays`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(availableDay),
    }
  );
  return handleResponse(response);
};

// ----------- UPDATE -----------
// PUT: /AvailableDays/{id}
export const updateAvailableDay = async (
  availableDayId: number,
  availableDay: AvailableDay
): Promise<AvailableDay | null> => {
  const response = await fetch(
    `${API_URL}/backend/HomeCareApi/AvailableDays/${availableDayId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(availableDay),
    }
  );
  return handleResponse(response);
};

// ----------- DELETE -----------
// DELETE: /AvailableDays/{id}
export const deleteAvailableDay = async (availableDayId: number) => {
  const response = await fetch(
    `${API_URL}/backend/HomeCareApi/AvailableDays/${availableDayId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );
  return handleResponse(response);
};
