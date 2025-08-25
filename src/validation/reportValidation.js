// src/validation/reportValidation.js
import { z } from "zod";

export const reportSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(255, "Subject is too long"),
  details: z
    .string()
    .min(1, "Details are required")
    .max(1000, "Details are too long"),
});
