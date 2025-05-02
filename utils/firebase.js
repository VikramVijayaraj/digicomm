import { v4 as uuid } from "uuid";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/app/firebaseConfig";

export async function uploadToFirebase(file, path) {
  if (!file) return; // Return if no file is selected

  const splittedFileName = file.name.toString().split(".");
  const storageRef = ref(
    storage,
    `${path}/${splittedFileName[0] + "_" + uuid() + "." + splittedFileName[1]}`,
  ); // Create a reference to the file in Firebase Storage
  // const storageRef = ref(storage, `shop-images/logos/${file.name + uuid()}`); // Create a reference to the file in Firebase Storage

  try {
    await uploadBytes(storageRef, file); // Upload the file to Firebase Storage
    const url = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
    console.log("File Uploaded Successfully");
    return url;
  } catch (error) {
    console.error("Error uploading the file", error);
    throw new Error("Failed to upload file");
  }
}

export default async function deleteFromFirebase(fileUrl) {
  try {
    // Extract the file path from the public URL
    const filePath = getFilePathFromUrl(fileUrl);

    // Create a reference to the file to delete
    const storageRef = ref(storage, filePath);

    // Delete the file
    await deleteObject(storageRef);
    console.log("File deleted: " + filePath);
  } catch (error) {
    console.error("Error deleting file: ", error);
  }
}

// Utility function to extract file path
function getFilePathFromUrl(url) {
  const baseUrl =
    "https://firebasestorage.googleapis.com/v0/b/digicomm-cbe9b.appspot.com/o/";
  const start = url.indexOf(baseUrl) + baseUrl.length;
  const end = url.indexOf("?alt=media");

  // Decode the URL-encoded path
  const filePath = decodeURIComponent(url.substring(start, end));
  return filePath;
}
