"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export default function BannerCTA() {
  return (
    <header className="">
      <div className="leading-10 md:leading-snug overflow-hidden">
        <div className="relative w-full h-[600px] md:h-[500px] lg:h-[700px] overflow-hidden">
          {/* Image */}
          <Image
            src="/images/hero/hero.webp"
            alt="Hero Image"
            fill
            className="hidden md:block object-cover scale-110"
          />
          <Image
            src="/images/hero/hero-mobile.webp"
            alt="Hero Image"
            fill
            className="md:hidden object-cover scale-110"
          />
          {/* Black tint overlay */}
          {/* <div className="absolute inset-0 " /> */}
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

    // <div
    //   className="bg-[url(https://images.unsplash.com/photo-1698807390276-725f3a7e41cf?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]
    //     h-[400px] lg:h-[500px] bg-cover"
    // >
    //   <div
    //     className="global-padding text-center flex flex-col items-center justify-center h-full
    //       bg-black/50"
    //   >
    //     <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
    //       Launch Your Digital Store Today
    //     </h2>
    //     <p className="text-lg md:text-xl text-white mb-6">
    //       Turn your ideas into income. Start selling digital products in minutes
    //       - no tech skills needed.
    //     </p>
    //     <Link
    //       href="/your/shop/dashboard"
    //       className="bg-primary-brand font-semibold text-white px-6 py-3 rounded-lg hover:bg-black
    //         transition-colors"
    //     >
    //       Start Your Store
    //     </Link>
    //   </div>
    // </div>
  );
}
