"use client";

import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";

export default function Header() {
  const { user } = useUser();

  return (
    <header className="border-b bg-white px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-6">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/assets/icons/logo-full.png"
              height={1000}
              width={1000}
              alt="DocTime Logo"
              className="h-10 w-fit"
            />
          </Link>
          <span className="text-xl font-bold text-[#0F172B]">DocTime</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-xl font-medium text-[#0F172B] hover:text-[#06A3DA] transition-colors">
            Home
          </Link>
          <Link href="/#features" className="text-xl font-medium text-[#0F172B] hover:text-[#06A3DA] transition-colors">
            Features
          </Link>
          <Link href="/#about" className="text-xl font-medium text-[#0F172B] hover:text-[#06A3DA] transition-colors">
            About
          </Link>
          <Link href="/#contact" className="text-xl font-medium text-[#0F172B] hover:text-[#06A3DA] transition-colors">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="flex items-center gap-3">
              <span className="text-[#0F172B] font-medium">
                Welcome, {user?.firstName || user?.fullName || 'User'}
              </span>
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
