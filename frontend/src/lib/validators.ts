import { z } from "zod";

export const createEventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  location: z.string().min(1, "Location is required"),
  eventDate: z
    .string()
    .min(1, "Date and time is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date and time",
    }),
  templateId: z.string().uuid("Invalid template selection"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;
