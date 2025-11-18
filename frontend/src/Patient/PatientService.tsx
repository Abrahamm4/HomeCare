const API_URL = import.meta.env.VITE_API_URL;

export interface Patient {
  patientId?: number;
  name: string;
  phone?: string | null;
  email?: string | null;
}

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
  if (response.ok) {  // 2xx
    if (response.status === 204) {
      return null;
    }
    return response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || 'Network response was not ok');
  }
};

// GET: api/patient
export const fetchPatients = async (): Promise<Patient[]> => {
  const response = await fetch(`${API_URL}/api/patient`);
  return handleResponse(response);
};

// GET: api/patient/{id}
export const fetchPatientById = async (patientId: string): Promise<Patient> => {
  const response = await fetch(`${API_URL}/api/patient/${patientId}`);
  return handleResponse(response);
};

// POST: api/patient
export const createPatient = async (patient: Patient): Promise<Patient> => {
  const response = await fetch(`${API_URL}/api/patient`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(patient),
  });
  return handleResponse(response);
};

// PUT: api/patient/{id}
export const updatePatient = async (
  patientId: number,
  patient: Patient
): Promise<Patient | null> => {
  const response = await fetch(`${API_URL}/api/patient/${patientId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(patient),
  });
  return handleResponse(response);
};

// DELETE: api/patient/{id}
export const deletePatient = async (patientId: number) => {
  const response = await fetch(`${API_URL}/api/patient/${patientId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

