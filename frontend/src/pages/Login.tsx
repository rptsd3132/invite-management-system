import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { loginWithEmailApi, loginWithGoogleAccessToken } from "../lib/api";
import { signInSchema, type SignInFormData } from "../lib/validators";

export function Login(): React.ReactElement {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const emailMutation = useMutation({
    mutationFn: loginWithEmailApi,
    onSuccess: (data) => {
      login(data.user, data);
      navigate("/dashboard", { replace: true });
    },
  });

  const googleMutation = useMutation({
    mutationFn: loginWithGoogleAccessToken,
    onSuccess: (data) => {
      login(data.user, data);
      navigate("/dashboard", { replace: true });
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      googleMutation.mutate(response.access_token);
    },
  });

  const onSubmit = (data: SignInFormData): void => {
    emailMutation.mutate(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Sign In</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back to Invitation Maker
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={googleMutation.isPending}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          >
            <GoogleIcon />
            {googleMutation.isPending ? "Connecting..." : "Continue with Google"}
          </button>

          {googleMutation.isError && (
            <p className="mt-3 text-center text-sm text-red-600">
              {googleMutation.error?.message ?? "Google sign-in failed"}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-[10px] font-medium tracking-widest text-neutral-400">
              OR SIGN IN WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <input
                {...register("identifier")}
                type="text"
                placeholder="Email or username"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
              {errors.identifier && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {emailMutation.isError && (
              <p className="text-sm text-red-600">
                {emailMutation.error?.message ?? "Invalid credentials"}
              </p>
            )}

            <button
              type="submit"
              disabled={emailMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4a5d23] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3d4f1c] disabled:opacity-50"
            >
              {emailMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {emailMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold text-[#4a5d23] hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
