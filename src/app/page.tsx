import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Users } from "lucide-react";
import {
  SignedIn,
  UserButton,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/logo-full.png"
              height={1000}
              width={1000}
              alt="patient"
              className=" h-10 w-fit"
            />
            <span className="text-xl font-bold">DocTime</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-green-400 text-white rounded">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Streamlined Healthcare Appointments
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect with healthcare professionals seamlessly. Schedule,
                    manage, and attend appointments with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button className="gap-1">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/images/landing.jpg"
                  width={550}
                  height={550}
                  alt="Hero Image"
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32" style={{ background: "#0F172B" }}>
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#06A3DA] px-3 py-1 text-sm text-white font-semibold shadow">
                  Features For Users
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Everything You Need for Healthcare Management
                </h2>
                <p className="max-w-[900px] text-[#B0B8C1] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive solution for both patients and healthcare providers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-7xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {/* First Column - First 3 Features */}
              <div className="grid gap-6">
                <div className="flex gap-4 items-start bg-white rounded-lg shadow p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06A3DA] text-white">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172B]">Easy Scheduling</h3>
                    <p className="text-[#6c757d]">
                      Book appointments with your preferred doctors at your convenience.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white rounded-lg shadow p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06A3DA] text-white">
                    <Clock className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172B]">Flexible Rescheduling</h3>
                    <p className="text-[#6c757d]">
                      Life happens. Easily reschedule appointments when needed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white rounded-lg shadow p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06A3DA] text-white">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172B]">Doctor Dashboard</h3>
                    <p className="text-[#6c757d]">
                      Doctors can manage their schedule and patient appointments efficiently.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Second Column - Last 3 Features */}
              <div className="grid gap-6">
                <div className="flex gap-4 items-start bg-white rounded-lg shadow p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06A3DA] text-white">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172B]">AI Chatbot Assistance</h3>
                    <p className="text-[#6c757d]">
                      Get instant answers to your healthcare queries with our AI chatbot.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white rounded-lg shadow p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06A3DA] text-white">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172B]">Prescription Upload</h3>
                    <p className="text-[#6c757d]">
                      Upload and manage your prescriptions securely within the app.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white rounded-lg shadow p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06A3DA] text-white">
                    <Users className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172B]">Audio Upload</h3>
                    <p className="text-[#6c757d]">
                      Upload audio recordings of your symptoms for better diagnosis and record-keeping.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Third Column - Image */}
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/images/vision.jpg"
                  width={400}
                  height={400}
                  alt="Features illustration"
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id="book-appointment"
          className="py-12 md:py-24 lg:py-32 w-full"
          style={{ background: "#0F172B" }}
        >
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Book Your Appointment
                </h2>
                <p className="max-w-[600px] text-[#B0B8C1] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Schedule your appointment with our healthcare professionals in
                  just a few clicks.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/appointment">
                  <button
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#06A3DA] to-[#0F172B] text-white font-bold text-lg shadow-lg transition-all duration-200 hover:from-[#057bb5] hover:to-[#0F172B] focus:outline-none"
                    style={{ letterSpacing: "1px" }}
                  >
                    Book Appointment
                    <ArrowRight className="inline ml-2 h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/logo-full.png"
              height={1000}
              width={1000}
              alt="patient"
              className=" h-10 w-fit"
            />
            <span className="text-lg font-bold">DocTime</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} DocTime. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
