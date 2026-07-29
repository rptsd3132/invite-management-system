import axios from "axios";
import type {
  AuthResponse,
  CreateEventPayload,
  EventDetailResponse,
  EventResponse,
  InvitationResponse,
  ParticipantResponse,
  Template,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("auth-storage");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.access_token ?? parsed?.access_token;
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

export async function loginWithGoogleApi(
  googleToken: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/google", {
    google_token: googleToken,
  });
  return data;
}

export async function loginWithGoogleAccessToken(
  accessToken: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/google", {
    google_access_token: accessToken,
  });
  return data;
}

export async function loginWithEmailApi(payload: {
  identifier: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
  return data;
}

export async function registerUserApi(payload: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
  return data;
}

export async function createEvent(
  payload: CreateEventPayload,
): Promise<EventResponse> {
  const { data } = await api.post<EventResponse>("/api/v1/events/", payload);
  return data;
}

export async function getEvents(): Promise<EventResponse[]> {
  const { data } = await api.get<EventResponse[]>("/api/v1/events");
  return data;
}

export async function getEvent(
  eventId: string,
): Promise<EventDetailResponse> {
  const { data } = await api.get<EventDetailResponse>(
    `/api/v1/events/${eventId}`,
  );
  return data;
}

export async function addParticipants(
  eventId: string,
  participants: { guest_name: string; email?: string }[],
): Promise<ParticipantResponse[]> {
  const { data } = await api.post<ParticipantResponse[]>(
    `/api/v1/events/${eventId}/participants`,
    { participants },
  );
  return data;
}

export async function getInvitationByToken(
  token: string,
): Promise<InvitationResponse> {
  const { data } = await api.get<InvitationResponse>(
    `/api/v1/invitation/${token}`,
  );
  return data;
}

export default api;
