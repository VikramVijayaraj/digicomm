import bcrypt from "bcryptjs";

export async function saltAndHashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
  return isPasswordMatch;
}