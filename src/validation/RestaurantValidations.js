// src/validation/RestaurantValidations.js

import { z } from "zod";

// Helper for file validation
const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant Name is required."),
  description: z.string().min(1, "Description is required."),

  // Use `owner_id` to match the API endpoint
  owner_id: z.string().min(1, "Please select an Owner/Manager."),

  // Make the photo optional in the schema but handle it in the form
  photo: z
    .any()
    .refine(
      (files) =>
        files?.length == 1 ? files?.[0]?.size <= MAX_FILE_SIZE : true,
      `Max image size is 5MB.`
    )
    .refine(
      (files) =>
        files?.length == 1
          ? ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)
          : true,
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(), // Make it optional as it's handled separately
});
