"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { sendEbookDownloadLink } from "@/actions/send-email-action";
import { getLeadAction, storeLeadAction } from "@/actions/lead-actions";
import { isValidEmail } from "@/utils/utils";
import { notifyOnSlack } from "@/lib/api";

export default function EbookModal({ loggedInUserEmail }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Check if the logged-in user has already submitted the form
  async function checkUserExists() {
    if (loggedInUserEmail) {
      const user = await getLeadAction(loggedInUserEmail);
      if (user) {
        setModalOpen(false);
      } else {
        // Only open modal if user doesn't exist
        setTimeout(() => setModalOpen(true), 5000);
      }
    } else {
      // Open modal if no logged in user
      setTimeout(() => setModalOpen(true), 5000);
    }
  }

  useEffect(() => {
    checkUserExists();

    return () => {}; // Empty cleanup function
  }, [loggedInUserEmail]); // Add loggedInUserEmail as dependency

  async function handleSubmit() {
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    // Validate email format
    const valid = isValidEmail(email);
    if (!valid) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setIsSubmitting(true);

    // Store the email in db
    await storeLeadAction(email);

    // Send the email
    const response = await sendEbookDownloadLink(email);

    if (response.success) {
      setEmail("");
      setEmailSuccess(true);
      setEmailError("");
      console.log("Ebook download link sent successfully");
    } else {
      alert("Failed to send the ebook download link. Please try again.");
    }

    setIsSubmitting(false);

    // Notify on Slack
    await notifyOnSlack(`${email} has requested the ebook download link.`);
  }

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative p-8 bg-white/95 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mx-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {!emailSuccess ? (
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-1/2 h-fit">
                  <img
                    className="object-cover w-full h-full mx-auto rounded-xl"
                    src="/images/ebook-cover.png"
                    alt="Ebook Cover"
                  />
                  {/* <Image
                  src="https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=3690&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  // width={100}
                  // height={100}
                  className="object-cover"
                  fill
                  alt="ebook"
                /> */}
                </div>

                <div className="w-full md:w-1/2">
                  <h2 className="text-xl lg:text-2xl text-center md:text-left font-bold mb-4 md:mb-8 w-full">
                    Free Ebook: Start Your Digital Product Business in India
                  </h2>
                  <p className="text-center md:text-left mb-4">
                    Want to turn your skills into income? This free ebook
                    reveals the best digital products to sell, platforms to use,
                    and smart marketing strategies tailored for the Indian
                    market. <br />
                    <br /> 👉 Grab your copy and kickstart your digital journey
                    today.
                  </p>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="mb-2 md:mt-8 md:mb-4 border border-gray-300 rounded-md p-2 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  {emailError && (
                    <p className="text-red-500 text-sm mb-2">{emailError}</p>
                  )}

                  <Button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full"
                  >
                    {isSubmitting ? "Sending..." : "Send me the ebook"}
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl lg:text-2xl text-center font-bold mb-4">
                  Thank you!
                </h2>
                <p className="text-center">
                  Your ebook has been sent to your email.
                </p>
                <p className="text-center">
                  Please check your inbox and spam folder.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
