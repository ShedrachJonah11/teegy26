import Image from "next/image";
import UploadForm from "@/components/UploadForm";

export const metadata = {
  title: "Share Photos | Tabitha & Babajide",
  description: "Upload your wedding photos",
};

export default function UploadPage() {
  return (
    <div className="flex-1 flex flex-col md:flex-row">
      {/* Photo panel — hidden on mobile, side panel on desktop */}
      <div className="hidden md:block md:w-2/5 relative">
        <Image
          src="/images/couples.png"
          alt="Tabitha & Babajide"
          fill
          className="object-cover"
          sizes="40vw"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-8 left-8 right-8">
          <p className="font-script text-3xl text-white">
            Share your moments
          </p>
          <p className="text-white/60 text-sm mt-1">
            Every photo tells a story
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-semibold text-charcoal">
              Upload Photos
            </h1>
            <p className="text-[13px] text-muted mt-1">
              Share your favorite moments from the celebration
            </p>
          </div>
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
