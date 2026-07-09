"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useClerk,
} from "@clerk/nextjs";

const FOOTER_LINKS = {
  product: [
    { label: "Book appointment", href: "/appointment" },
    { label: "My appointments", href: "/my-appointments" },
    { label: "My prescriptions", href: "/my-prescriptions" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/#services" },
    { label: "Contact", href: "/about" },
  ],
};

export default function Footer() {
  const { signOut } = useClerk();

  return (
    <footer className="border-t border-white/[0.08] bg-[#0A0A0A] text-white tracking-wide">
      <div className="max-w-[76rem] mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="text-lg font-medium text-white mb-4 inline-block tracking-wide">
              DocTime
            </Link>
            <p className="text-sm text-white/65 leading-relaxed tracking-wide">
              Healthcare made simple. Book, manage, and track your care — all in one place.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-white/65 mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-white/65 mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white transition-colors tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-white/65 mb-4">
              Account
            </h4>
            <ul className="space-y-2">
              <SignedOut>
                <li>
                  <SignInButton mode="modal">
                    <button className="text-sm text-white/80 hover:text-white transition-colors tracking-wide">
                      Sign in
                    </button>
                  </SignInButton>
                </li>
                <li>
                  <SignUpButton mode="modal">
                    <button className="text-sm text-white/80 hover:text-white transition-colors tracking-wide">
                      Sign up
                    </button>
                  </SignUpButton>
                </li>
              </SignedOut>
              <SignedIn>
                <li>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-white/80 hover:text-white transition-colors tracking-wide"
                  >
                    Sign out
                  </button>
                </li>
              </SignedIn>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.08]">
          <p className="text-sm text-white/65 tracking-wide">
            © {new Date().getFullYear()} DocTime. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="text-sm text-white/80 hover:text-white transition-colors tracking-wide">
              Terms
            </Link>
            <Link href="/about" className="text-sm text-white/80 hover:text-white transition-colors tracking-wide">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
