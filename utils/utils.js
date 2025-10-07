import slugify from "slugify";
import { nanoid } from "nanoid";
import imageCompression from "browser-image-compression";

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email); // Returns true if the email matches the regex pattern
}

export function formatFileName(name) {
  const splittedFileName = name.toString().split(".");
  const sanitizedFileName = slugify(splittedFileName[0], {
    lower: true,
    strict: true,
  });
  const fileName =
    sanitizedFileName + "_" + nanoid(10) + "." + splittedFileName[1];
  return fileName;
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
