// Client-side: use a relative URL so requests go through the Next.js rewrite
// proxy (avoids CORS and works in any deployment environment).
// Server-side (Next.js API routes): use the internal backend URL directly.
const API_BASE =
  typeof window !== "undefined"
    ? "/api/v1"
    : (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api/v1");

/* ── Types ─────────────────────────────────────────────── */

export interface ApiError {
  message: string;
  status: number;
}

export interface ChefResponse {
  id: number;
  username: string;
  email: string;
  status: string;
  lastLogin: string | null;
  chefProfileId: number | null;
  chefProfile: ChefProfileResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChefProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  preferredName: string;
  address: string;
  profilePicture: string;
  description: string;
  signature: string;
  verified: boolean;
  fhsCertificate: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Helpers ───────────────────────────────────────────── */

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data?.error || data?.message || `Request failed (${res.status})`;
    throw { message, status: res.status } as ApiError;
  }

  return data as T;
}

/* ── Chef Auth ─────────────────────────────────────────── */

export async function registerChef(payload: {
  username: string;
  password: string;
  email: string;
}): Promise<ChefResponse> {
  return request<ChefResponse>("/chefs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginChef(payload: {
  username: string;
  password: string;
}): Promise<ChefResponse> {
  return request<ChefResponse>("/chefs/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ── Chef Profile ──────────────────────────────────────── */

export async function createChefProfile(payload: {
  firstName: string;
  lastName: string;
  preferredName?: string;
  address?: string;
  description?: string;
}): Promise<ChefProfileResponse> {
  return request<ChefProfileResponse>("/chef-profiles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getChef(id: number): Promise<ChefResponse> {
  return request<ChefResponse>(`/chefs/${id}`);
}

export async function getAllChefs(): Promise<ChefResponse[]> {
  return request<ChefResponse[]>("/chefs");
}

export async function updateChef(
  id: number,
  payload: { username?: string; email?: string; status?: string }
): Promise<ChefResponse> {
  return request<ChefResponse>(`/chefs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a chef's password.
 * Called server-side from the reset-password API route after token verification.
 */
export async function updateChefPassword(
  id: number,
  password: string
): Promise<ChefResponse> {
  return request<ChefResponse>(`/chefs/${id}`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
}

export async function deleteChef(id: number): Promise<{ message: string }> {
  return request<{ message: string }>(`/chefs/${id}`, { method: "DELETE" });
}

/* ── Chef Profile (extended) ─────────────────────────── */

export async function getChefProfile(id: number): Promise<ChefProfileResponse> {
  return request<ChefProfileResponse>(`/chef-profiles/${id}`);
}

export async function getAllProfiles(): Promise<ChefProfileResponse[]> {
  return request<ChefProfileResponse[]>("/chef-profiles");
}

export async function updateChefProfile(
  id: number,
  payload: {
    firstName?: string;
    lastName?: string;
    preferredName?: string;
    address?: string;
    description?: string;
    verified?: boolean;
  }
): Promise<ChefProfileResponse> {
  return request<ChefProfileResponse>(`/chef-profiles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/* ── Users ────────────────────────────────────────────── */

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAllUsers(): Promise<UserResponse[]> {
  return request<UserResponse[]>("/users");
}
