import slugify from "slugify";
import { v4 as uuid } from "uuid";

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
  const fileName = sanitizedFileName + "_" + uuid() + "." + splittedFileName[1];
  return fileName;
}
