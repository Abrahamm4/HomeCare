import { jwtDecode } from "jwt-decode";
import type { LoginDto, RegisterDto } from "../types/Auth";
import type { User } from "../types/User";

const API_BASE_URL = "https://localhost:7272"; //Can be changed after backend is done
const TOKEN_KEY = "homecare_jwt";

interface AuthResponse {
  token: string;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function decodeToken(token: string | null): User | null {
  if (!token) return null;
  try {
    return jwtDecode<User>(token);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}

export async function login(
  dto: LoginDto
): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = (await response.json()) as AuthResponse;
  const user = decodeToken(data.token);
  if (!user) {
    throw new Error("Invalid token");
  }

  saveToken(data.token);
  return { token: data.token, user };
}

export async function register(dto: RegisterDto): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }
}

export function logout(): void {
  saveToken(null);
}
