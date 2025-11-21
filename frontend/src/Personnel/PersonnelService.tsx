import type { Personnel } from '../types/Personnel';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (response.ok) {  // HTTP status code success 200-299
    if (response.status === 204) { // Delete / update (NoContent)
      return null;
    }
    return response.json(); // other returns response body as JSON
  } else {
    const errorText = await response.text();
    throw new Error(errorText || 'Network response was not ok');
  }
};

// GET: api/personnel
export const fetchPersonnels = async (): Promise<Personnel[]> => {
  const response = await fetch(`${API_URL}/api/personnel`);
  return handleResponse(response);
};

// GET: api/personnel/{id}
export const fetchPersonnelById = async (
  personnelId: string
): Promise<Personnel> => {
  const response = await fetch(`${API_URL}/api/personnel/${personnelId}`);
  return handleResponse(response);
};


// POST: api/personnel
export const createPersonnel = async (
  personnel: Personnel
): Promise<Personnel> => {
  const response = await fetch(`${API_URL}/api/personnel`, {
    method: 'POST',
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
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(personnel),
  });
  return handleResponse(response);
};

// DELETE: api/personnel/{id}
export const deletePersonnel = async (personnelId: number) => {
  const response = await fetch(`${API_URL}/api/personnel/${personnelId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
