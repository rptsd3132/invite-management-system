const rawGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";

const placeholderClientIds = new Set([
  "your-client-id-string-from-google-console.apps.googleusercontent.com",
  "your-client-id.apps.googleusercontent.com",
  "1234567890-abcdefg.apps.googleusercontent.com",
]);

export const googleClientId = rawGoogleClientId;

export const isGoogleOAuthConfigured =
  rawGoogleClientId.length > 0 &&
  rawGoogleClientId.endsWith(".apps.googleusercontent.com") &&
  !placeholderClientIds.has(rawGoogleClientId);
