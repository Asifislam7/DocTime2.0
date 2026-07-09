"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import { Calendar, LogOut, FileText, User } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", mobile: true },
  { href: "/#services", label: "Services", mobile: false },
  { href: "/about", label: "About", mobile: false },
  { href: "/my-appointments", label: "My Care", mobile: true },
  { href: "/appointment", label: "Book", mobile: true },
];

export default function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] pointer-events-none [&_*]:pointer-events-auto">
      <div className="flex h-16 items-center justify-between max-w-[76rem] mx-auto px-4 md:px-6 bg-transparent">
        <Link
          href="/"
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <Image
            src="/assets/icons/logo-full.png"
            height={1000}
            width={1000}
            alt="DocTime Logo"
            className="h-8 w-auto"
            priority
          />
          <span className="text-sm font-medium tracking-wide">DocTime</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  item.mobile ? "inline" : "hidden md:inline"
                } ${
                  isActive
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <SignedIn>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-sm font-medium text-white/80 hover:text-white tracking-wide transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                {user?.firstName || user?.fullName || "Account"}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-52 bg-[#141414] rounded-lg border border-white/[0.08] py-2 shadow-xl">
                  <Link
                    href="/my-appointments"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors tracking-wide"
                  >
                    <Calendar className="h-4 w-4" />
                    My Appointments
                  </Link>
                  <Link
                    href="/my-prescriptions"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors tracking-wide"
                  >
                    <FileText className="h-4 w-4" />
                    My Prescriptions
                  </Link>
                  <Link
                    href="/appointment"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors tracking-wide"
                  >
                    <User className="h-4 w-4" />
                    Book Appointment
                  </Link>
                  <div className="border-t border-white/[0.08] mt-1 pt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.04] transition-colors w-full text-left tracking-wide bg-transparent border-0 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-sm font-medium text-white/80 hover:text-white tracking-wide transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="text-sm font-medium text-white/80 hover:text-white tracking-wide transition-colors bg-transparent border-0 p-0 cursor-pointer"
              >
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </div>

      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
