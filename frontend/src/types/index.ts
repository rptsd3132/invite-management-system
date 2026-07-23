export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string | null;
  design_schema: Record<string, unknown>;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "organizer";
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface GoogleAuthResponse extends AuthTokens {
  user: User;
}
