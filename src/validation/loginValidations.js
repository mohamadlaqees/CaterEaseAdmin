import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
});
