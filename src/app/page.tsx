"use client";

import Hero from "./components/hero";
import { Eye, MapPin, Heart } from "lucide-react";

export default function Page() {
  return (
    <div>
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">What is SpoilerAlert?</h2>
          <br />
          <p className="text-xl mb-6">
            SpoilerAlert is a smart tool designed to help you avoid hidden food recalls by using computer vision and real-time FDA recall data to check if a product is safe to buy or consume.
          </p>
          <br />
          <div className="flex flex-row justify-between items-center gap-5">
            <div
              className="p-6 w-[300px] h-[180px] ring-2 ring-[#669bbc] rounded-xl flex items-center border-rose-300 border"
              style={{ boxShadow: "0 4px 6px rgb(255, 90, 95)" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-customSecondary rounded-full flex justify-center items-center">
                  <Eye className="w-10/12 h-10/12 text-customPrimary" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-poppins font-bold text-xl text-customAccent">
                    Computer Vision
                  </p>
                  <p className="font-redHatText font-medium text-base text-customAccent/60">
                    Instantly verify product safety using <br />
                    cutting-edge computer vision.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="p-6 w-[300px] h-[180px] ring-2 ring-[#669bbc] rounded-xl flex items-center border-rose-300 border"
              style={{ boxShadow: "0 4px 6px rgb(255, 90, 95)" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-customSecondary rounded-full flex justify-center items-center">
                  <MapPin className="w-10/12 h-10/12 text-customPrimary" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-poppins font-bold text-xl text-customAccent">
                    Area Tracking
                  </p>
                  <p className="font-redHatText font-medium text-base text-customAccent/60">
                    Monitor recall frequency in your <br />
                    area to stay informed.
                  </p>
                </div>
              </div>
            </div>
            <div
              className="p-6 w-[300px] h-[180px] ring-2 ring-[#669bbc] rounded-xl flex items-center border-rose-300 border"
              style={{ boxShadow: "0 4px 6px rgb(255, 90, 95)" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-customSecondary rounded-full flex justify-center items-center">
                  <Heart className="w-10/12 h-10/12 text-customPrimary" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-poppins font-bold text-xl text-customAccent">
                    Health Benefits
                  </p>
                  <p className="font-redHatText font-medium text-base text-customAccent/60">
                    Make healthier choices by avoiding <br />
                    recalled foods for improved well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
