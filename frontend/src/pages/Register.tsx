import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerWithEmailApi } from "../lib/api";
import { useAuthStore } from "../store/authStore";

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export function Register(): React.ReactElement {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const registerMutation = useMutation({
    mutationFn: registerWithEmailApi,
    onSuccess: (data) => {
      login(data.user, data);
      navigate("/dashboard", { replace: true });
    },
  });

  const onSubmit = (values: FormValues): void => {
    registerMutation.mutate({ email: values.email, password: values.password });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Create account</h1>
          <p className="mt-1 text-sm text-neutral-500">Start building invitations</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {registerMutation.isError && (
            <p className="text-sm text-red-600">
              {registerMutation.error?.message ?? "Registration failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="flex w-full items-center justify-center rounded-full bg-[#4a5d23] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#3d4f1c] disabled:opacity-50"
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full text-center text-sm font-medium text-[#4a5d23] hover:underline"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}