import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { MainContent } from "@/components/MainContent";
import "./globals.css";
import "./landing.css";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DocTime - Healthcare Appointment System",
  description: "Book appointments with healthcare professionals online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="dark bg-[#0A0A0A]">
        <body className={`${instrumentSerif.variable} ${manrope.variable} dark bg-[#0A0A0A] text-white`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <ToastProvider>
              <MainContent>{children}</MainContent>
              <Footer />
              <Chatbot />
            </ToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
