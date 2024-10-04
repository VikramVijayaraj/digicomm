"use client";

import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebaseConfig";

export default function Delete() {
  function onDelete() {
    // Create a reference to the file to delete
    const desertRef = ref(
      storage,
      "shop-images/logos/Logo.png1983a2da-1f2e-4256-bcc8-bf966d0f7e55_copy.png1983a2da-1f2e-4256-bcc8-bf966d0f7e55",
    );

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log("File deleted!");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
      });
  }

  return <button onClick={onDelete}>Delete</button>;
}
