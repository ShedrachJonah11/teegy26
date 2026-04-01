import Link from "next/link";
import Image from "next/image";
import QRCode from "@/components/QRCode";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ──── HERO ──── */}
      <section className="relative w-full h-screen">
        {/* Portrait photo — fills viewport, positioned to show both subjects */}
        <Image
          src="/images/couples2.jpeg"
          alt="Tabitha & Babajide"
          fill
          className="object-cover object-[50%_30%]"
          priority
          sizes="100vw"
          quality={90}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Text overlaid on photo */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-6">
          <p className="fade-in text-[10px] tracking-[0.4em] uppercase text-white/60 mb-5">
            The wedding celebration of
          </p>

          <h1 className="fade-in fade-in-d1 font-script text-5xl sm:text-6xl leading-[1.1] mb-0.5 drop-shadow-lg">
            Tabitha
          </h1>
          <p className="fade-in fade-in-d1 font-serif text-[10px] tracking-[0.4em] uppercase text-white/50 mb-4">
            Jonah Mark
          </p>

          <p className="fade-in fade-in-d2 font-script text-xl text-gold-light mb-4 drop-shadow-md">
            &amp;
          </p>

          <h1 className="fade-in fade-in-d2 font-script text-5xl sm:text-6xl leading-[1.1] mb-0.5 drop-shadow-lg">
            Babajide
          </h1>
          <p className="fade-in fade-in-d2 font-serif text-[10px] tracking-[0.4em] uppercase text-white/50 mb-8">
            Emmanuel Fakile
          </p>

          {/* Date */}
          <div className="fade-in fade-in-d3 flex items-center justify-center gap-3">
            <div className="h-px w-6 bg-white/20" />
            <p className="font-serif text-[12px] tracking-[0.2em] uppercase text-white/70">
              08 &middot; April &middot; 2026
            </p>
            <div className="h-px w-6 bg-white/20" />
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
