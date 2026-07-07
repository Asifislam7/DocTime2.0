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
import { ChevronDown, User, Calendar, LogOut, FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
  };

  return (
    <header
      className={`sticky top-0 z-[100] border-b transition-all duration-300 ${
        isHome
          ? "bg-white/95 dark:bg-[#0F172B]/95 backdrop-blur-md border-[#E2E8F0] dark:border-white/10"
          : "bg-white/95 dark:bg-[#0F172B]/95 backdrop-blur-md border-gray-200/80 dark:border-white/10"
      }`}
    >
      <div className="flex h-16 items-center justify-between max-w-[72rem] mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/assets/icons/logo-full.png"
              height={1000}
              width={1000}
              alt="DocTime Logo"
              className="h-8 w-fit"
            />
            <span className="text-lg font-bold text-[#0F172B] dark:text-white">
              DocTime
            </span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/#services", label: "Services" },
            { href: "/about", label: "About" },
            { href: "/my-appointments", label: "My Care" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-[#0F172B] dark:text-white/90 hover:text-[#06A3DA] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/appointment"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold bg-[#06A3DA] hover:bg-[#057bb5] text-white rounded-md transition-colors"
          >
            Request appointment
          </Link>
          
          <SignedIn>
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-[#06A3DA] rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="text-[#0F172B] dark:text-white font-medium transition-colors duration-300">
                  {user?.firstName || user?.fullName || 'User'}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-all duration-300">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  
                  <Link 
                    href="/my-appointments"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <Calendar className="h-4 w-4" />
                    My Appointments
                  </Link>
                  
                  <Link 
                    href="/my-prescriptions"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <FileText className="h-4 w-4" />
                    My Prescriptions
                  </Link>
                  
                  <Link 
                    href="/appointment"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
                  >
                    <User className="h-4 w-4" />
                    Book Appointment
                  </Link>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300 w-full text-left"
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
              <button className="px-4 py-2 text-sm font-medium text-[#0F172B] dark:text-white hover:text-[#06A3DA] transition-colors duration-300">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-5 py-2 text-sm font-medium bg-[#06A3DA] hover:bg-[#057bb5] text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#06A3DA]/25">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
      
      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
