import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "../store/authStore";
import { loginWithGoogleApi } from "../lib/api";

export function Login(): React.ReactElement {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const googleMutation = useMutation({
    mutationFn: loginWithGoogleApi,
    onSuccess: (data) => {
      login(data.user, data);
      navigate("/dashboard", { replace: true });
    },
  });

  const handleGoogleSuccess = useCallback(
    (response: CredentialResponse) => {
      if (response.credential) {
        googleMutation.mutate(response.credential);
      }
    },
    [googleMutation],
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Sign In</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back to Invitation Maker
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {}}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          </div>

          {googleMutation.isError && (
            <p className="mt-4 text-center text-sm text-red-600">
              {googleMutation.error?.message ?? "Google sign-in failed"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
