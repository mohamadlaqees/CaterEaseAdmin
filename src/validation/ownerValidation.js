import { z } from "zod";

const phoneSchema = z.string().regex(/^\d{10}$/, {
  message: "Phone number must be exactly 10 digits.",
});

export const ownerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: phoneSchema,
  gender: z.enum(["m", "f"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),
  // Password is optional, but if provided, it must meet the length requirement.
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  status: z.enum(["active", "deleted"], {
    errorMap: () => ({ message: "Please select a status." }),
  }),
});

export const editOwnerSchema = ownerSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .optional()
    .or(z.literal("")),
});
