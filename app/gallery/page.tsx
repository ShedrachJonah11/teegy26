import Gallery from "@/components/Gallery";

export const metadata = {
  title: "Gallery | Tabitha & Babajide",
  description: "Browse wedding photos shared by guests",
};

export default function GalleryPage() {
  return (
    <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            Gallery
          </h1>
          <p className="text-sm text-muted mt-1">
            Moments captured by family and friends
          </p>
        </div>
        <Gallery />
      </div>
    </div>
  );
}
