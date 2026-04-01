"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import type { Upload } from "@/lib/types";

const PAGE_SIZE = 20;

export default function Gallery() {
  const [photos, setPhotos] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<Upload | null>(null);

  const fetchPhotos = useCallback(async (offset: number) => {
    const { data, error: fetchError } = await getSupabase()
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (fetchError) {
      setError("Failed to load photos.");
      return [];
    }
    if (!data || data.length < PAGE_SIZE) setHasMore(false);
    return (data as Upload[]) || [];
  }, []);

  useEffect(() => {
    fetchPhotos(0).then((data) => {
      setPhotos(data);
      setLoading(false);
    });
  }, [fetchPhotos]);

  async function loadMore() {
    setLoadingMore(true);
    const data = await fetchPhotos(photos.length);
    setPhotos((prev) => [...prev, ...data]);
    setLoadingMore(false);
  }

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-muted-lighter border-t-charcoal rounded-full animate-spin" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-sm text-charcoal-light">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-charcoal font-medium hover:underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty
  if (photos.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <svg
          className="w-12 h-12 mx-auto text-muted-lighter"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
          />
        </svg>
        <p className="text-charcoal font-medium">No photos yet</p>
        <p className="text-sm text-muted">Be the first to share a moment</p>
        <Link
          href="/upload"
          className="inline-block bg-charcoal text-white text-sm font-medium py-2.5 px-6 rounded-lg hover:bg-charcoal-light transition-colors"
        >
          Upload photos
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 sm:gap-3 space-y-2 sm:space-y-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid group cursor-pointer"
            onClick={() => setLightbox(photo)}
          >
            <div className="relative overflow-hidden rounded-lg bg-cream-dark">
              <Image
                src={photo.file_url}
                alt={`Photo by ${photo.uploader_name}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-0 inset-x-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-[11px] font-medium drop-shadow-lg">
                  {photo.uploader_name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="text-sm text-charcoal font-medium px-6 py-2.5 rounded-lg border border-muted-lighter hover:border-charcoal/20 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.file_url}
              alt={`Photo by ${lightbox.uploader_name}`}
              width={1200}
              height={900}
              className="w-full h-auto max-h-[82vh] object-contain"
              sizes="90vw"
              priority
            />
            <p className="text-center text-white/50 text-sm mt-4">
              {lightbox.uploader_name}
              <span className="mx-2 text-white/20">/</span>
              {new Date(lightbox.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
