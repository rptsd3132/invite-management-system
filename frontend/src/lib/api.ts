import axios from "axios";
import type { GoogleAuthResponse, Template } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("auth-storage");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

export async function getTemplates(): Promise<Template[]> {
  const { data } = await api.get<Template[]>("/api/templates");
  return data;
}

export async function loginWithGoogleApi(googleToken: string): Promise<GoogleAuthResponse> {
  const { data } = await api.post<GoogleAuthResponse>("/api/auth/google", {
    google_token: googleToken,
  });
  return data;
}

export async function loginWithGoogleAccessToken(
  accessToken: string,
): Promise<GoogleAuthResponse> {
  const { data } = await api.post<GoogleAuthResponse>("/api/auth/google", {
    google_access_token: accessToken,
  });
  return data;
}

export async function loginWithEmailApi(payload: {
  email: string;
  password: string;
}): Promise<GoogleAuthResponse> {
  const { data } = await api.post<GoogleAuthResponse>("/api/auth/login", payload);
  return data;
}

export async function registerWithEmailApi(payload: {
  email: string;
  password: string;
}): Promise<GoogleAuthResponse> {
  const { data } = await api.post<GoogleAuthResponse>("/api/auth/register", payload);
  return data;
}

export default api;
