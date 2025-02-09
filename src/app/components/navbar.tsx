'use client'
import Link  from "next/link"
import { useState } from 'react';

export default function Navbar() {
    const [isToggle, setIsToggle] = useState(false);

    function toggleNav() {
        setIsToggle(!isToggle)
    }

    return (
        <>
            <div className="w-full sticky top-0 left-0 right-0 z-10 bg-[#fefae0]">
                <div className='max-w-7xl h-16 flex mx-auto px-4 justify-between items-center lg:px-8'>
                <div className=" flex items-center flex-shrink-0">
                    <Link href="/" className="text-black font-Qwitcher font-bold text-4xl">Spoiler Alert</Link>
                </div>
                <div className="hidden md:inline-block">
                    <div className="space-x-4 text-2xl">
                        <Link href="/safety" className="text-[#415a77] hover:bg-[#d4a373] hover:text-[#fefae0] rounded-xl p-2">Safety</Link>
                        <Link href="/availability" className="text-[#415a77] hover:bg-[#d4a373] hover:text-[#fefae0] rounded-xl p-2">Availability</Link>
                    </div>
                </div>
                <div className='md:hidden flex items-center'>
                    <button className='p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset'
                    onClick={toggleNav}>
                    {isToggle ? <p className="text-black"> X </p> : <p className="text-black">Menu</p>}
                    </button>
                </div>
            </div>
            {isToggle && (
                <div className='md:hidden'>
                    <div className="space-y-1 px-2 pb-3">
                        <Link href="/safety" className="block  text-[#415a77] hover:bg-[#d4a373] hover:text-[#fefae0] rounded-lg p-2">Safety</Link>
                        <Link href="/availability" className="block text-[#415a77] hover:bg-[#d4a373] hover:text-[#fefae0]  rounded-lg p-2">Availability</Link>
                    </div>
                </div>
            )}
        </div>
    </>
    )
}