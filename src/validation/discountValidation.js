import { z } from "zod";

export const discountSchema = z.object({
  value: z
    .string()
    .min(1, "Value is required.")
    .transform((val) => parseFloat(val))
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Value must be a non-negative number."
    ),
  description: z.string().min(1, "Description is required!"),
  startDate: z.date({
    required_error: "Start Date is required!",
    invalid_type_error: "Please enter a valid date",
  }),
  endDate: z.date({
    required_error: "End Date is required!",
    invalid_type_error: "Please enter a valid date",
  }),
});
