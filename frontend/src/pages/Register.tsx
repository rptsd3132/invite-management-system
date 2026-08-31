import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "../store/authStore";
<<<<<<< HEAD
import { loginWithGoogleAccessToken, registerUserApi } from "../lib/api";
import { signUpSchema, type SignUpFormData } from "../lib/validators";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
=======
import {
  loginWithGoogleAccessToken,
  registerUserApi,
} from "../lib/api";
import {
  signUpSchema,
  type SignUpFormData,
} from "../lib/validators";
>>>>>>> main

export function Register(): React.ReactElement {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

const registerMutation = useMutation({
  mutationFn: (data: SignUpFormData) =>
    registerUserApi({
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
    }),

onSuccess: (data) => {
  localStorage.setItem("token", data.access_token);

  login(data.user, data);

  navigate("/dashboard", {
    replace: true,
  });
},
});

const googleMutation = useMutation({
  mutationFn: loginWithGoogleAccessToken,

  onSuccess: (data) => {
  localStorage.setItem("token", data.access_token);

  login(data.user, data);

  navigate("/dashboard", {
    replace: true,
  });
},
});

<<<<<<< HEAD
=======
  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      googleMutation.mutate(response.access_token);
    },

    onError: () => {
      console.error("Google login failed");
    },
  });

>>>>>>> main
  const onSubmit = (data: SignUpFormData): void => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Get Started
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Create your account to start building invitations
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
<<<<<<< HEAD
          <GoogleSignInButton
            onToken={(token) => googleMutation.mutate(token)}
            isPending={googleMutation.isPending}
            errorMessage={
              googleMutation.isError
                ? googleMutation.error?.message ?? "Google sign-up failed"
                : undefined
            }
            idleLabel="Continue with Google"
            pendingLabel="Connecting..."
          />
=======
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={googleMutation.isPending}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />

            {googleMutation.isPending
              ? "Connecting..."
              : "Continue with Google"}
          </button>

          {googleMutation.isError && (
            <p className="mt-3 text-center text-sm text-red-600">
              {googleMutation.error instanceof Error
                ? googleMutation.error.message
                : "Google sign-up failed"}
            </p>
          )}
>>>>>>> main

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />

            <span className="text-[10px] font-medium tracking-widest text-neutral-400">
              OR SIGN UP WITH EMAIL
            </span>

            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder="First name"
                  autoComplete="given-name"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
                />

                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Last name"
                  autoComplete="family-name"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
                />

                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register("username")}
                type="text"
                placeholder="Username"
                autoComplete="username"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
              />

              {errors.username && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email address"
                autoComplete="email"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password (min 8 characters)"
                autoComplete="new-password"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
              />

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-400 focus:outline-none"
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {registerMutation.isError && (
              <p className="text-sm text-red-600">
                {registerMutation.error instanceof Error
                  ? registerMutation.error.message
                  : "Registration failed"}
              </p>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4a5d23] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3d4f1c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {registerMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {registerMutation.isPending
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold text-[#4a5d23] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

function GoogleIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        fill="#4285F4"
      />

      <path
        d="M12 23c2.97 0 5.46-.98 7.29-2.66l-3.57-2.77c-.98.66-2.24 1.06-3.72 1.06-2.87 0-5.3-1.94-6.17-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />

      <path
        d="M5.83 14.1A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.44.35-2.1V7.07H2.15A11 11 0 0 0 1 12c0 1.78.43 3.45 1.15 4.93l2.86-2.22.82-.61Z"
        fill="#FBBC05"
      />

      <path
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.16-3.15A10.56 10.56 0 0 0 12 1 11 11 0 0 0 2.15 7.07L5.83 9.9C6.7 7.31 9.13 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}
>>>>>>> main
