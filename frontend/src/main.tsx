import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.tsx";
import { googleClientId, isGoogleOAuthConfigured } from "./lib/googleAuth";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const app = <App />;

createRoot(root).render(
  <StrictMode>
    {isGoogleOAuthConfigured ? (
      <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
    ) : (
      app
    )}
  </StrictMode>,
);
