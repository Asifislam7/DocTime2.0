export const STATS = [
  { value: "50+", label: "Specialist doctors" },
  { value: "10k+", label: "Appointments booked" },
  { value: "24/7", label: "Online scheduling" },
];

export const CARE_INTENTS = [
  {
    title: "I need care now",
    links: [
      { label: "Book urgent visit", href: "/appointment" },
      { label: "AI health assistant", href: "#chatbot" },
      { label: "View my appointments", href: "/my-appointments" },
    ],
  },
  {
    title: "I need to explore care",
    links: [
      { label: "Find a doctor", href: "/appointment" },
      { label: "View services", href: "#services" },
      { label: "Learn about DocTime", href: "/about" },
    ],
  },
  {
    title: "I need help with records",
    links: [
      { label: "My appointments", href: "/my-appointments" },
      { label: "My prescriptions", href: "/my-prescriptions" },
      { label: "Download visit slips", href: "/my-appointments" },
    ],
  },
];

export const SPECIALTIES = [
  { name: "Primary Care", image: "/assets/images/doctor.png" },
  { name: "Cardiology", image: "/assets/images/surgery.jpg" },
  { name: "Neurology", image: "/assets/images/national-cancer-institute-L8tWZT4CcVQ-unsplash.jpg" },
  { name: "Orthopedics", image: "/assets/images/marcelo-leal-k7ll1hpdhFA-unsplash.jpg" },
  { name: "Pediatrics", image: "/assets/images/onboarding-img.png" },
  { name: "Dermatology", image: "/assets/images/feature-bg.jpg" },
];

export const VALUE_PROPS = [
  {
    title: "Advanced specialty care",
    desc: "Experienced specialists with expertise in managing complex healthcare needs.",
  },
  {
    title: "Seamless scheduling",
    desc: "Book, reschedule, or cancel appointments online — available 24/7 from any device.",
  },
  {
    title: "Secure health records",
    desc: "Upload prescriptions and manage your medical documents safely in one trusted place.",
  },
  {
    title: "AI-powered support",
    desc: "Get instant guidance about appointments and DocTime services with our assistant.",
  },
];

export const QUICK_LINKS = [
  { label: "Find a doctor", href: "/appointment" },
  { label: "Book appointment", href: "/appointment" },
  { label: "My appointments", href: "/my-appointments" },
  { label: "About DocTime", href: "/about" },
];

export const TESTIMONIAL = {
  quote:
    "DocTime made booking my specialist visit effortless. I had my appointment confirmed in minutes — no phone calls, no waiting.",
  author: "Sarah M.",
  role: "DocTime patient",
};
