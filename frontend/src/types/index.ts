export type OverlayMode =
  | "full"
  | "minimal"
  | "positioned";

export type TextAlign =
  | "left"
  | "center"
  | "right";

export type TextFamily =
  | "serif"
  | "sans"
  | "mono";

export type TextSize =
  | "hero"
  | "xl"
  | "lg"
  | "md"
  | "sm"
  | "xs";

export type ValuePart =
  | "full"
  | "date"
  | "time";

export interface PositionedText {
  x: number;
  y: number;
  width?: number;
  size?: TextSize;
  color?: string;
  align?: TextAlign;
  family?: TextFamily;
  weight?: number;
  letter_spacing?: string;
  uppercase?: boolean;
  shadow?: boolean;
  value_part?: ValuePart;
  prefix?: string;
  suffix?: string;
}

export interface StaticText extends PositionedText {
  text: string;
}

export interface DesignSchema {
  background_image?: string | null;
  background_position?: string;
  style_key?: import("../components/ui/templateStyles").TemplateStyleKey;
  category?: string;
  badge_text?: string | null;
  eyebrow_text?: string | null;

  required_fields: string[];

  overlay_mode?: OverlayMode;
  display_fields?: string[];

  aspect_ratio?: string;

  layout?: Record<
    string,
    PositionedText
  >;

  static_texts?: StaticText[];

  container_classes?: string;
  background?: string;
}

export interface Template {
  id: string;
  user_id: string | null;
  name: string;
  category: string;
  thumbnail_url: string | null;
  design_schema: DesignSchema;
  created_at: string;
}

export interface CreateTemplatePayload {
  name: string;
  category: string;
  design_schema: DesignSchema;
  thumbnail_url?: string | null;
}

export interface User {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email: string;
  role: string;
  is_active: boolean;
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}
export interface CreateEventPayload {
  template_id: string;
  event_name: string;
  location: string;
  event_date: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  event_metadata?: Record<string, string>;
}

export interface EventResponse {
  id: string;
  user_id: string;
  template_id: string;
  event_name: string;
  location: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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
  personal_note?: string | null;
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
