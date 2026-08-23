import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { loginWithEmailApi, loginWithGoogleAccessToken } from "../lib/api";
import { signInSchema, type SignInFormData } from "../lib/validators";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";

export function Login(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";
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
  localStorage.setItem("token", data.access_token);

  login(data.user, data);

  navigate(from, { replace: true });
},
  });

  const googleMutation = useMutation({
    mutationFn: loginWithGoogleAccessToken,
    onSuccess: (data) => {
  localStorage.setItem("token", data.access_token);

  login(data.user, data);

  navigate(from, { replace: true });
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
          <GoogleSignInButton
            onToken={(token) => googleMutation.mutate(token)}
            isPending={googleMutation.isPending}
            errorMessage={
              googleMutation.isError
                ? googleMutation.error?.message ?? "Google sign-in failed"
                : undefined
            }
          />

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
