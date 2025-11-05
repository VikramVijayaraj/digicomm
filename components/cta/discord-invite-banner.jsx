import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa6";

import { Button } from "@/components/ui/button";

const userAvatars = [
  "/images/community/1.webp",
  "/images/community/2.webp",
  "/images/community/3.webp",
  "/images/community/4.webp",
  "/images/community/5.webp",
  "/images/community/6.webp",
];

export default function DiscordInviteBanner() {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#5865F2] to-[#7289DA] py-8 md:py-12 lg:py-16 text-white overflow-hidden">
      {/* Background decoration elements (toned down for a banner) */}
      <div className="absolute top-1/4 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse opacity-70"></div>
      <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-200 opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 md:gap-8 lg:gap-12 relative z-10">
        {/* Left Section: Title and Description */}
        <div className="flex flex-col items-center md:items-start flex-grow">
          <FaDiscord className="h-12 w-12 text-white mb-3 md:mb-4" />{" "}
          {/* Discord Logo */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-2">
            JOIN OUR <span className="text-[#57F287]">COMMUNITY</span>!
          </h2>
          <p className="text-white text-opacity-90 text-base md:text-lg max-w-lg">
            Connect, Learn, Share & Grow with Fellow Creators.
          </p>
        </div>

        {/* Right Section: Avatars, Member Count & Button */}
        <div className="flex flex-col items-center gap-4">
          {/* User Avatars Section */}
          <div className="relative flex justify-center -space-x-2 mb-2">
            {userAvatars.map((avatar, index) => (
              <Image
                key={index}
                src={avatar}
                alt={`Community member ${index + 1}`}
                width={40} // Base size (from md:w-10)
                height={40} // Base size (from md:h-10)
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white object-cover shadow-md"
                style={{ zIndex: userAvatars.length - index }} // Ensures correct overlap
                priority={index < 3} // Optional: Prioritize loading the first few images
              />
            ))}
            {/* Small decorative elements like the "rockets" and "chat bubbles" */}
            <div className="absolute top-0 -left-4 w-3 h-3 bg-[#fff] rounded-full opacity-70 animate-ping" />
            <div className="absolute bottom-0 -right-4 w-2 h-2 bg-[#57F287] rounded-full opacity-70 animate-ping delay-150" />
          </div>

          {/* <p className="text-white text-opacity-80 text-sm md:text-base">
            Over 100+ Members Strong!
          </p> */}

          <Button
            asChild
            className="bg-[#57F287] hover:bg-[#4ddf7d] text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 text-base md:text-lg"
            size="lg"
          >
            <Link
              href="https://discord.gg/vQEX864W"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <FaDiscord className="h-5 w-5 md:h-6 md:w-6" />
              JOIN OUR DISCORD!
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
