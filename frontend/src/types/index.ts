export interface DesignTypography {
  title_classes: string;
  accent_classes: string;
  body_classes: string;
}

export interface DesignSchema {
  container_classes: string;
  background: string;
  decorations: string[];
  typography: DesignTypography;
  required_fields: string[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string | null;
  design_schema: DesignSchema;
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

export interface CreateEventPayload {
  template_id: string;
  event_name: string;
  location: string;
  event_date: string;
  event_metadata?: Record<string, string>;
}

export interface EventResponse {
  id: string;
  user_id: string;
  template_id: string;
  event_name: string;
  location: string;
  event_date: string;
  event_metadata: Record<string, string>;
  created_at: string;
}

export interface ParticipantResponse {
  id: string;
  event_id: string;
  guest_name: string;
  email: string | null;
  unique_link_token: string;
  rsvp_status: string;
  created_at: string;
}

export interface EventDetailResponse extends EventResponse {
  participants: ParticipantResponse[];
}

export interface InvitationResponse {
  event: EventResponse;
  participant: ParticipantResponse;
  template: Template;
  field_data: Record<string, string>;
}
