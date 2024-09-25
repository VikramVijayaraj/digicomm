import { z } from "zod";

// Schema for Product
export const productSchema = z.object({
  name: z.string().min(2, { message: "Product name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  images: z.any().refine((files) => files && files.length > 0, {
    message: "At least one image is required",
  }),
  stock: z.preprocess(
    (value) => (value !== "" ? Number(value) : undefined), // Ensure empty strings are not passed as 0
    z
      .number({ invalid_type_error: "Stock must be a number" })
      .min(1, { message: "Stock must be at least 1" }), // Custom message for stock less than 1
  ),
  price: z.preprocess(
    (value) => (value !== "" ? Number(value) : undefined), // Ensure empty strings are not passed as 0
    z
      .number({ invalid_type_error: "Price must be a number" })
      .min(1, { message: "Price must be at least 1 rupee" }), // Custom message for price
  ),
});

// Schema for Shop
export const shopSchema = z.object({
  logo: z.any().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});
