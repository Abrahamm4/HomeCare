import type { Personnel } from "../types/Personnel";
import { getStoredToken } from "../Auth/AuthService";

const API_URL = import.meta.env.VITE_API_URL;

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

// GET: api/personnel
export const fetchPersonnels = async (): Promise<Personnel[]> => {
  const response = await fetch(`${API_URL}/api/personnel`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// GET: api/personnel/{id}
export const fetchPersonnelById = async (
  personnelId: string
): Promise<Personnel> => {
  const response = await fetch(`${API_URL}/api/personnel/${personnelId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// POST: api/personnel
export const createPersonnel = async (
  personnel: Personnel
): Promise<Personnel> => {
  const response = await fetch(`${API_URL}/api/personnel`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(personnel),
  });
  return handleResponse(response);
};

// PUT: api/personnel/{id}
export const updatePersonnel = async (
  personnelId: number,
  personnel: Personnel
): Promise<Personnel | null> => {
  const response = await fetch(`${API_URL}/api/personnel/${personnelId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(personnel),
  });
  return handleResponse(response);
};

// DELETE: api/personnel/{id}
export const deletePersonnel = async (personnelId: number) => {
  const response = await fetch(`${API_URL}/api/personnel/${personnelId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
