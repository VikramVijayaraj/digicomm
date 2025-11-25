import slugify from "slugify";
import { nanoid } from "nanoid";
import imageCompression from "browser-image-compression";

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email); // Returns true if the email matches the regex pattern
}

export function formatFileName(name, forcedExtension = null) {
  // Handle filenames with multiple dots
  const lastDotIndex = name.lastIndexOf(".");
  const nameWithoutExtension = name.substring(0, lastDotIndex);
  const originalExtension = name.substring(lastDotIndex + 1);

  // Sanitize the name
  const sanitizedFileName = slugify(nameWithoutExtension, {
    lower: true,
    strict: true,
  });

  // Use forced extension (webp) if provided, otherwise use original
  const finalExtension = forcedExtension || originalExtension;

  return `${sanitizedFileName}_${nanoid(10)}.${finalExtension}`;
}

export async function optimizeImage(file, type = "default") {
  // Options based on image type
  const configMap = {
    shopBanner: {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1920,
      fileType: "image/webp",
      initialQuality: 0.85,
    },
    shopLogo: {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 512,
      fileType: "image/webp",
      initialQuality: 0.9,
    },
    productImage: {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      fileType: "image/webp",
      initialQuality: 0.8,
    },
    blogImage: {
      maxSizeMB: 1.2,
      maxWidthOrHeight: 1600,
      fileType: "image/webp",
      initialQuality: 0.85,
    },
    default: {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      fileType: "image/webp",
      initialQuality: 0.8,
    },
  };

  const options = {
    useWebWorker: true, // Use multi-threading for faster processing
    ...configMap[type],
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // console.log("Original file size:", file.size / 1024 / 1024, "MB");
    // console.log(
    //   "Compressed file size:",
    //   compressedFile.size / 1024 / 1024,
    //   "MB",
    // );
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return file; // Return original if compression fails
  }
}

// Helper function to clean the URL
// Input: "https://api.crelands.com/.../object/public/public-assets/folder/img.png"
// Output: "public-assets/folder/img.png"
export function getStoragePath(url) {
  if (!url) return null;

  // If it's already a full URL, strip the domain and the 'object' API path
  if (url.includes("/object/public/")) {
    return url.split("/object/public/")[1];
  }

  return url;
}
