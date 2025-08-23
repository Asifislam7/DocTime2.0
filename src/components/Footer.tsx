import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-6 transition-colors duration-300">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo-full.png"
            height={1000}
            width={1000}
            alt="DocTime Logo"
            className="h-10 w-fit"
          />
          <span className="text-lg font-bold text-[#0F172B] dark:text-white transition-colors duration-300">DocTime</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <span>© {new Date().getFullYear()} DocTime. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          <span>Healthcare made simple</span>
        </div>
      </div>
    </footer>
  );
}
