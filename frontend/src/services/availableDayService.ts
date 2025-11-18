import type {AvailableDay} from '../types/AvailableDay';

const API_URL = import.meta.env.VITE_API_URL;

//GET all
export async function getAvailableDays(): Promise<AvailableDay[]> {
    const response = await fetch(`${API_URL}/HomeCareApi/AvailableDays`);
    if(!response.ok) throw new Error("fail");
    return await response.json();
}

//UPDATE
export const updateAvailableDay = async (day: AvailableDay) => {
  const res = await fetch(`${API_URL}/api/AvailableDays/${day.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(day),
  });
  if (!res.ok) throw new Error("Failed to update available day");
  return await res.json();
};
console.log("FETCHING:", `${API_URL}/api/AvailableDays`);