"use client"

import Header from "@/app/components/header";

import RollingGallery from './reactbits/Sliding'

export default function Hero() {

    return (
        <div className="w-full h-full flex bg-[#F6e3ba] flex-col pb-10 items-center justify-center  text-foreground dark:text-muted">
            <div className="flex flex-col items-center justify-center w-full h-full">
                <Header/>
            </div>
            <RollingGallery autoplay={true} pauseOnHover={true} />
      </div>
    )
}