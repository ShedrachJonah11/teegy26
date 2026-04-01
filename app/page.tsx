import Link from "next/link";
import QRCode from "@/components/QRCode";
import HeroCarousel from "@/components/HeroCarousel";

// Add more image paths here as you add photos to public/images/
const HERO_IMAGES = [
  "/images/couples.png",
  "/images/couples.png", // duplicate for now — replace with new photos
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ──── HERO: Full viewport with carousel ──── */}
      <section className="relative h-svh min-h-[600px] flex items-end justify-center overflow-hidden">
        {/* Carousel background */}
        <HeroCarousel images={HERO_IMAGES} />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/70 z-10" />

        {/* Content overlaid */}
        <div className="relative z-20 text-center text-white px-6 pb-20 w-full max-w-lg">
          <p className="fade-in text-[11px] tracking-[0.4em] uppercase text-white/60 mb-6">
            The wedding celebration of
          </p>

          <h1 className="fade-in fade-in-d1 font-script text-6xl sm:text-7xl leading-[1.1] mb-1 drop-shadow-lg">
            Tabitha
          </h1>
          <p className="fade-in fade-in-d1 font-serif text-[11px] tracking-[0.4em] uppercase text-white/50 mb-5">
            Jonah Mark
          </p>

          <p className="fade-in fade-in-d2 font-script text-2xl text-gold-light mb-5 drop-shadow-md">
            &amp;
          </p>

          <h1 className="fade-in fade-in-d2 font-script text-6xl sm:text-7xl leading-[1.1] mb-1 drop-shadow-lg">
            Babajide
          </h1>
          <p className="fade-in fade-in-d2 font-serif text-[11px] tracking-[0.4em] uppercase text-white/50 mb-10">
            Emmanuel Fakile
          </p>

          {/* Date line */}
          <div className="fade-in fade-in-d3 flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-8 bg-white/20" />
            <p className="font-serif text-[13px] tracking-[0.2em] uppercase text-white/70">
              08 &middot; April &middot; 2026
            </p>
            <div className="h-px w-8 bg-white/20" />
          </div>

          {/* Scroll hint */}
          <div className="fade-in fade-in-d4 bounce-slow">
            <svg
              className="w-5 h-5 mx-auto text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ──── CTA SECTION ──── */}
      <section className="bg-cream">
        <div className="max-w-md mx-auto px-6 py-16 text-center space-y-8">
          <div className="space-y-3">
            <p className="font-script text-3xl text-copper">
              Share your moments
            </p>
            <p className="text-[13px] text-muted leading-relaxed">
              Help us relive this beautiful day. Upload your photos and browse
              memories captured by family and friends.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/upload"
              className="flex-1 bg-charcoal text-white font-serif text-[13px] font-medium py-4 px-6 rounded-md tracking-[0.1em] uppercase hover:bg-charcoal-light transition-colors text-center"
            >
              Upload Photos
            </Link>
            <Link
              href="/gallery"
              className="flex-1 text-charcoal font-serif text-[13px] font-medium py-4 px-6 rounded-md border border-charcoal tracking-[0.1em] uppercase hover:bg-charcoal hover:text-white transition-colors text-center"
            >
              View Gallery
            </Link>
          </div>

          <div className="pt-4">
            <QRCode />
          </div>
        </div>
      </section>
    </div>
  );
}
