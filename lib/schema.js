import { z } from "zod";

// Sign In schema
export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

// Sign Up schema
export const signUpSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be more than 2 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  // source: z.string(),
});

// Product
export const productSchema = z.object({
  name: z.string().min(2, { message: "Product name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  images: z.any().refine((files) => files && files.length > 0, {
    message: "At least one image is required",
  }),
  files: z
    .any()
    // .refine((files) => files && files.length > 0, {
    //   message: "At least one file is required",
    // })
    .optional(),
  // stock: z.preprocess(
  //   (value) => (value !== "" ? Number(value) : undefined), // Ensure empty strings are not passed as 0
  //   z
  //     .number({ invalid_type_error: "Stock must be a number" })
  //     .min(1, { message: "Stock must be at least 1" }), // Custom message for stock less than 1
  // ),
  price: z.preprocess(
    (value) => (value !== "" ? Number(value) : undefined), // Ensure empty strings are not passed as 0
    z
      .number({ invalid_type_error: "Price must be a number" })
      .min(1, { message: "Price must be at least 1 rupee" }), // Custom message for price
  ),
});

// Shop
export const shopSchema = z.object({
  banner: z.any().optional(),
  logo: z.any().optional(),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});

// User
export const userSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  phone: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        return value.trim(); // remove extra spaces
      }
      return value;
    },
    z.string({ required_error: "Phone number is required" }).regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits.",
    }), // Check for exactly 10 digits
  ),
  address1: z
    .string()
    .min(3, { message: "Address Line 1 must be at least 3 characters." }),
  address2: z.string().optional(),
  city: z
    .string()
    .min(2, { message: "City must be atleast 2 characters long." }),
  state: z
    .string()
    .min(2, { message: "State must be atleast 2 characters long." }),
  country: z
    .string()
    .min(2, { message: "Country must be atleast 2 characters long." }),
  zipCode: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        return value.trim(); // remove extra spaces
      }
      return value;
    },
    z.string({ required_error: "Zip code is required" }).regex(/^\d{6}$/, {
      message: "Zip code must be exactly 6 digits.",
    }),
  ),
});

// Product reviews
export const productReviewSchema = z.object({
  rating: z.preprocess(
    (val) => parseFloat(val),
    z
      .number({ required_error: "Star rating is required." })
      .min(1, { message: "Rating must be between 1 and 5" })
      .max(5, { message: "Rating must be between 1 and 5" }),
  ),
  comment: z.string().optional(),
});

// Shop payment details
export const paymentDetailsSchema = z.object({
  accountHolderName: z.string().min(2, {
    message: "Account holder name must be at least 2 characters.",
  }),
  accountNumber: z.string().min(8, {
    message: "Account number must be at least 8 characters.",
  }),
  // bankName: z.string().min(2, {
  //   message: "Bank name must be at least 2 characters.",
  // }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
    message: "Invalid IFSC code. It should be in the format ABCD0123456.",
  }),
  phone: z.string().optional(),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

// Contact Email schema
export const contactEmailSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export const refundEmailSchema = z.object({
  buyerEmail: z.string().email(),
  sellerEmail: z.string().email(),
  orderItemId: z.string(),
  sellerFirstName: z.string(),
  productName: z.string(),
  quantity: z.string(),
  price: z.string(),
  orderPlacedAt: z.string(),
});

// Forgot Password
export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

// Reset Password
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Order Tracking Email Form
export const orderTrackingEmailSchema = z.object({
  deliveryServiceProvider: z.string().min(2),
  trackingNumber: z.string().min(2),
});

// Source Info Schema
export const infoSchema = z.object({
  source: z.string({
    required_error: "Please select the source.",
  }),
});
