import Header from "@/components/Header";

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen bg-[#0A0A0A] text-white">
      <Header />
      {children}
    </main>
  );
}
