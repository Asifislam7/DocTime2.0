import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="py-4 md:py-6 lg:py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <main>
        <section className="py-12 md:py-24 lg:py-32 xl:py-48 px-4 lg:px-12 md:px-6">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-white transition-colors duration-300">
                    Streamlined Healthcare Appointments
                  </h1>
                  <p className="max-w-[600px] text-gray-600 dark:text-gray-300 md:text-xl transition-colors duration-300">
                    Connect with healthcare professionals seamlessly. Schedule,
                    manage, and attend appointments with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="#book-appointment" className="text-xl font-medium text-[#0F172B] dark:text-white hover:text-[#06A3DA] dark:hover:text-[#06A3DA] transition-colors hover:bg-transparent">
                    <Button className="gap-1 bg-[#06A3DA] hover:bg-[#057bb5] dark:bg-[#06A3DA] dark:hover:bg-[#057bb5] transition-all duration-300">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/images/landing.jpg"
                  width={550}
                  height={550}
                  alt="Hero Image"
                  className="rounded-lg object-cover shadow-2xl dark:shadow-gray-900/50 transition-all duration-300"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/images/feature-bg-2.jpg"
              alt="Features Background"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/60 dark:bg-black/70 transition-all duration-300"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2 animate-fade-in">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white animate-slide-up animation-delay-200">
                  Everything You Need for Healthcare Management
                </h2>
                <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slide-up animation-delay-400">
                  Our platform provides a comprehensive solution for both patients and healthcare providers.
                </p>
              </div>
            </div>
            
            {/* Features Grid - Text Only */}
            <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-2 lg:gap-16">
              {/* Left Column */}
              <div className="space-y-8 animate-slide-up animation-delay-600">
                <div className="text-center lg:text-left group cursor-pointer transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-bold text-[#06A3DA] mb-3 transition-all duration-300 group-hover:text-white group-hover:text-3xl group-hover:mb-4">Easy Scheduling</h3>
                  <p className="text-white/90 text-lg leading-relaxed transition-all duration-300 group-hover:text-white group-hover:text-xl group-hover:leading-relaxed">
                    Book appointments with your preferred doctors at your convenience. Our intuitive interface makes scheduling simple and quick.
                  </p>
                </div>
                
                <div className="text-center lg:text-left group cursor-pointer transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-bold text-[#06A3DA] mb-3 transition-all duration-300 group-hover:text-white group-hover:text-3xl group-hover:mb-4">Flexible Rescheduling</h3>
                  <p className="text-white/90 text-lg leading-relaxed transition-all duration-300 group-hover:text-white group-hover:text-xl group-hover:leading-relaxed">
                    Life happens. Easily reschedule appointments when needed with just a few clicks. No more phone calls or waiting on hold.
                  </p>
                </div>
                
                <div className="text-center lg:text-left group cursor-pointer transition-all duration-1000 hover:scale-105">
                  <h3 className="text-2xl font-bold text-[#06A3DA] mb-3 transition-all duration-300 group-hover:text-white group-hover:text-3xl group-hover:mb-4">Doctor Dashboard</h3>
                  <p className="text-white/90 text-lg leading-relaxed transition-all duration-300 group-hover:text-white group-hover:text-xl group-hover:leading-relaxed">
                    Doctors can manage their schedule and patient appointments efficiently through our comprehensive dashboard.
                  </p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-8 animate-slide-up animation-delay-800">
                <div className="text-center lg:text-left group cursor-pointer transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-bold text-[#06A3DA] mb-3 transition-all duration-300 group-hover:text-white group-hover:text-3xl group-hover:mb-4">AI Chatbot Assistance</h3>
                  <p className="text-white/90 text-lg leading-relaxed transition-all duration-300 group-hover:text-white group-hover:text-xl group-hover:leading-relaxed">
                    Get instant answers to your healthcare queries with our intelligent AI chatbot. Available 24/7 for your convenience.
                  </p>
                </div>
                
                <div className="text-center lg:text-left group cursor-pointer transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-bold text-[#06A3DA] mb-3 transition-all duration-300 group-hover:text-white group-hover:text-3xl group-hover:mb-4">Prescription Upload</h3>
                  <p className="text-white/90 text-lg leading-relaxed transition-all duration-300 group-hover:text-white group-hover:text-xl group-hover:leading-relaxed">
                    Upload and manage your prescriptions securely within the app. Keep all your medical documents in one place.
                  </p>
                </div>
                
                <div className="text-center lg:text-left group cursor-pointer transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-bold text-[#06A3DA] mb-3 transition-all duration-300 group-hover:text-white group-hover:text-3xl group-hover:mb-4">Audio Upload</h3>
                  <p className="text-white/90 text-lg leading-relaxed transition-all duration-300 group-hover:text-white group-hover:text-xl group-hover:leading-relaxed">
                    Upload audio recordings of your symptoms for better diagnosis and record-keeping. Share your concerns with healthcare providers easily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section
          id="book-appointment"
          className="py-12 md:py-24 lg:py-32 w-full bg-gradient-to-br from-[#0F172B] via-[#1e293b] to-[#0F172B] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500"
        >
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-white">
                  Book Your Appointment
                </h2>
                <p className="max-w-[600px] text-gray-300 dark:text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Schedule your appointment with our healthcare professionals in
                  just a few clicks.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/appointment">
                  <button
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#06A3DA] via-[#3b82f6] to-[#06A3DA] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#06A3DA]/30"
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
    </div>
  );
}
