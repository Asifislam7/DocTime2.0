"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative w-10 h-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 flex items-center justify-center group-hover:scale-105 group-hover:shadow-lg"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300 dark:scale-0 dark:rotate-90" />
        <Moon className="absolute h-5 w-5 text-blue-500 transition-all duration-300 scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
        
        {/* Hover effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
        {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-white"></div>
      </div>
    </div>
  );
}

export function ThemeToggleWithSystem() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <div className="relative group">
      <div className="flex items-center space-x-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
        <button
          onClick={() => setTheme("light")}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === "light"
              ? "bg-blue-500 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          aria-label="Light theme"
        >
          <Sun className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => setTheme("system")}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === "system"
              ? "bg-blue-500 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          aria-label="System theme"
        >
          <Monitor className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => setTheme("dark")}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === "dark"
              ? "bg-blue-500 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          aria-label="Dark theme"
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
        Theme: {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-white"></div>
      </div>
    </div>
  );
}
