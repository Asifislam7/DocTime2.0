import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock, Users } from "lucide-react"

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
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
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
                    Connect with healthcare professionals seamlessly. Schedule, manage, and attend appointments with
                    ease.
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

        <section id="features" className="bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need for Healthcare Management
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive solution for both patients and healthcare providers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="flex gap-4 items-start">
                  <Calendar className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold">Easy Scheduling</h3>
                    <p className="text-muted-foreground">
                      Book appointments with your preferred doctors at your convenience.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Clock className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold">Flexible Rescheduling</h3>
                    <p className="text-muted-foreground">Life happens. Easily reschedule appointments when needed.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Users className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold">Doctor Dashboard</h3>
                    <p className="text-muted-foreground">
                      Doctors can manage their schedule and patient appointments efficiently.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  width={400}
                  height={400}
                  alt="Features illustration"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our simple three-step process makes healthcare management a breeze.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Register</h3>
                <p className="text-muted-foreground">
                  Create an account with your personal details and medical information.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Book</h3>
                <p className="text-muted-foreground">
                  Schedule an appointment with your preferred doctor at a convenient time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Attend</h3>
                <p className="text-muted-foreground">
                  Visit the doctor at the scheduled time or attend a virtual consultation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of patients and doctors who are already using our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-1">
                    Register Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
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
  )
}
