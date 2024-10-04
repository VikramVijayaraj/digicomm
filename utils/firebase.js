import { ref, deleteObject } from "firebase/storage";

import { storage } from "@/app/firebaseConfig";

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
