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
