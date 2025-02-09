"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-0 z-50 w-full">
      <div className="w-full bg-background/40 backdrop-blur-md border-b border-border/40">
        <nav className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="font-semibold hover:opacity-80 transition-opacity">
              LOGO
            </Link>

            {/* Theme Toggle */}
          </div>
        </nav>
      </div>
    </div>
  );
} 