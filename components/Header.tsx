"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`${
        isHome
          ? "absolute top-0 left-0 right-0 z-50"
          : "sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-muted-lighter/50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={`font-serif text-xl font-semibold tracking-wide ${isHome ? "text-white" : "text-copper"}`}
        >
          T &amp; B
        </Link>
        <nav className="flex items-center gap-8 text-[13px] font-medium tracking-[0.12em] uppercase">
          <Link
            href="/upload"
            className={`transition-colors duration-200 ${
              isHome
                ? "text-white/80 hover:text-white"
                : pathname === "/upload"
                  ? "text-copper"
                  : "text-charcoal-light hover:text-copper"
            }`}
          >
            Upload
          </Link>
          <Link
            href="/gallery"
            className={`transition-colors duration-200 ${
              isHome
                ? "text-white/80 hover:text-white"
                : pathname === "/gallery"
                  ? "text-copper"
                  : "text-charcoal-light hover:text-copper"
            }`}
          >
            Gallery
          </Link>
        </nav>
      </div>
    </header>
  );
}
