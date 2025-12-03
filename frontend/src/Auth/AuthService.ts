import { jwtDecode } from "jwt-decode";
import type { LoginDto, RegisterDto } from "../types/Auth";
import type { User } from "../types/User";

const API_BASE_URL = "https://localhost:7272";
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
    const decoded = jwtDecode<User>(token);
    console.log("Decoded JWT:", decoded);

    const user: User = {
      sub:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.sub,
      nameid:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded.nameid,
      role:
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
      iss: decoded.iss,
      aud: decoded.aud,
      jti: decoded.jti,
    };

    console.log("Mapped User:", user);
    return user;
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
    const errorBody = await response.json().catch(() => null);

    // show only detail from error response
    const message =
      errorBody?.detail ||
      errorBody?.title ||
      "Login failed";

    throw new Error(message);
  }

  const data = (await response.json()) as AuthResponse;
  console.log("Token from backend:", data.token);

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
    const errorBody = await response.json().catch(() => null);

    // Show only detail from error response
    const message =
      errorBody?.detail ||
      errorBody?.title ||
      "Registration failed";

    throw new Error(message);
  }
}

export function logout(): void {
  saveToken(null);
}
