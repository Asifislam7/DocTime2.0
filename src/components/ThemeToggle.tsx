"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-[#141414] animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full bg-[#141414] border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 text-[#E8723C] transition-all duration-300 dark:scale-0 dark:rotate-90" />
      <Moon className="absolute h-4 w-4 text-[#F5E6D3] transition-all duration-300 scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
    </button>
  );
}
