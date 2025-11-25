"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function BannerCTA() {
  return (
    <header className="">
      <div className="leading-10 md:leading-snug overflow-hidden">
        <div className="relative w-full h-[600px] md:h-[500px] lg:h-[700px] overflow-hidden">
          {/* DESKTOP IMAGE */}
          <Image
            src="/images/hero/hero.webp"
            alt="Hero Image Desktop"
            fill
            priority // Load this immediately
            className="hidden md:block object-cover scale-110"
            sizes="100vw"
            unoptimized={true}
          />

          {/* MOBILE IMAGE */}
          <Image
            src="/images/hero/hero-mobile.webp"
            alt="Hero Image Mobile"
            fill
            priority // Load this immediately
            className="md:hidden object-cover scale-110"
            sizes="100vw"
            unoptimized={true}
          />

          {/* Text overlay */}
          <div
            className="absolute inset-0 pt-20 md:pt-0 pr-4 md:pr-0 pl-4 sm:pl-6 md:pl-8 lg:pl-16
              xl:pl-36 flex flex-col justify-start md:justify-center items-start text-black
              w-full md:w-1/2"
          >
            <h1
              className="text-[42px] md:text-[58px] lg:text-[92px] font-bold mb-4 drop-shadow-lg
                leading-none w-full text-center md:text-left"
            >
              From Idea to Income
            </h1>

            <p
              className="text-gray-700 text-base md:text-[20px] drop-shadow leading-6 md:leading-normal
                text-center md:text-left"
            >
              The modern marketplace for Indian creators to sell eBooks,
              templates, courses, and digital art.
            </p>

            <div className="md:space-x-4 mt-8 w-full text-center md:text-left">
              <Button
                asChild
                className="h-[48px] text-[20px] p-[26px] bg-gradient-to-r from-primary-brand to-red-400
                  text-white hover:from-primary-light hover:to-primary-brand hover:scale-105
                  transition-transform"
              >
                <Link href="/your/shop/dashboard">Start Selling Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
