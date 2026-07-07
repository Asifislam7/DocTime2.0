"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] dark:border-white/10 bg-[#F8FAFC] dark:bg-[#0F172B]">
      <div className="max-w-[72rem] mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/logo-full.png"
              height={1000}
              width={1000}
              alt="DocTime Logo"
              className="h-8 w-fit"
            />
            <span className="text-lg font-bold text-[#0F172B] dark:text-white">DocTime</span>
          </div>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
            © {new Date().getFullYear()} DocTime. Healthcare made simple.
          </p>
        </div>
      </div>
    </footer>
  );
}
