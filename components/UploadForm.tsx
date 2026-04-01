"use client";

import { useCallback, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { getSupabase, BUCKET_NAME } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface FileProgress {
  name: string;
  progress: number;
  status: "pending" | "compressing" | "uploading" | "done" | "error";
  error?: string;
}

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [fileProgress, setFileProgress] = useState<FileProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback((incoming: FileList | File[]): File[] => {
    const valid: File[] = [];
    for (const file of Array.from(incoming)) {
      if (!ALLOWED_TYPES.includes(file.type)) continue;
      if (file.size > MAX_FILE_SIZE) continue;
      if (valid.length >= MAX_FILES) break;
      valid.push(file);
    }
    return valid;
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles(validateFiles(e.target.files));
    setIsDone(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (!e.dataTransfer.files) return;
    setFiles(validateFiles(e.dataTransfer.files));
    setIsDone(false);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload() {
    if (files.length === 0) return;

    const { allowed, retryAfterMs } = checkRateLimit();
    if (!allowed) {
      const mins = Math.ceil(retryAfterMs / 60000);
      alert(`Too many uploads. Please wait ${mins} minute(s) and try again.`);
      return;
    }

    setIsUploading(true);
    setIsDone(false);

    const progress: FileProgress[] = files.map((f) => ({
      name: f.name,
      progress: 0,
      status: "pending",
    }));
    setFileProgress([...progress]);

    const supabase = getSupabase();
    for (let i = 0; i < files.length; i++) {
      try {
        progress[i] = { ...progress[i], status: "compressing", progress: 30 };
        setFileProgress([...progress]);

        const compressed = await imageCompression(files[i], {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: "image/webp",
        });

        const uniqueName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.webp`;
        const filePath = `photos/${uniqueName}`;

        progress[i] = { ...progress[i], status: "uploading", progress: 65 };
        setFileProgress([...progress]);

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, compressed, {
            contentType: "image/webp",
            upsert: false,
          });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

        const { error: dbError } = await supabase.from("uploads").insert({
          file_url: publicUrl,
          uploader_name: uploaderName.trim() || "A Beloved Guest",
        });
        if (dbError) throw dbError;

        progress[i] = { ...progress[i], status: "done", progress: 100 };
        setFileProgress([...progress]);
      } catch (err) {
        progress[i] = {
          ...progress[i],
          status: "error",
          progress: 0,
          error: err instanceof Error ? err.message : "Upload failed",
        };
        setFileProgress([...progress]);
      }
    }

    setIsUploading(false);
    if (progress.every((p) => p.status === "done")) {
      setIsDone(true);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm text-charcoal mb-1.5">
          Your name{" "}
          <span className="text-muted-light text-xs">(optional)</span>
        </label>
        <input
          id="name"
          type="text"
          maxLength={50}
          placeholder="e.g. Uncle Tunde"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          className="w-full border border-muted-lighter bg-white rounded-lg px-4 py-3 text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-charcoal/10 focus:border-charcoal/30 transition-all"
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? "border-charcoal/30 bg-cream-dark"
            : "border-muted-lighter hover:border-muted-light bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="space-y-3">
          <svg
            className="w-10 h-10 mx-auto text-muted-light"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>
            <p className="text-sm text-charcoal font-medium">
              Click to browse or drag photos here
            </p>
            <p className="text-xs text-muted mt-1">
              JPG, PNG, or WebP &bull; Max 5MB &bull; Up to {MAX_FILES} photos
            </p>
          </div>
        </div>
      </div>

      {/* Selected files */}
      {files.length > 0 && !isUploading && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted font-medium uppercase tracking-wider">
            {files.length} selected
          </p>
          {files.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="flex items-center justify-between bg-cream-dark rounded-lg px-3 py-2"
            >
              <span className="truncate text-charcoal-light text-xs max-w-[240px]">
                {f.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-muted-light hover:text-charcoal ml-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Progress */}
      {isUploading && (
        <div className="space-y-3">
          {fileProgress.map((fp, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="truncate max-w-[200px] text-charcoal-light">{fp.name}</span>
                <span className="text-muted capitalize">{fp.status}</span>
              </div>
              <div className="h-1 bg-cream-dark rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fp.status === "error" ? "bg-red-400" : fp.status === "done" ? "bg-teal" : "bg-charcoal"
                  }`}
                  style={{ width: `${fp.progress}%` }}
                />
              </div>
              {fp.error && <p className="text-xs text-red-500">{fp.error}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && !isUploading && !isDone && (
        <button
          onClick={handleUpload}
          className="w-full bg-charcoal text-white text-sm font-medium py-3.5 rounded-lg hover:bg-charcoal-light transition-colors active:scale-[0.99]"
        >
          Upload {files.length} photo{files.length > 1 ? "s" : ""}
        </button>
      )}

      {/* Success */}
      {isDone && (
        <div className="text-center bg-teal/5 border border-teal/15 rounded-xl p-8 space-y-2">
          <svg className="w-10 h-10 mx-auto text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-serif text-lg text-charcoal font-medium">
            Thank you!
          </p>
          <p className="text-sm text-muted">
            Your memories have been shared with the couple.
          </p>
          <button
            onClick={() => setIsDone(false)}
            className="text-sm text-teal font-medium hover:underline underline-offset-4 mt-1"
          >
            Upload more
          </button>
        </div>
      )}
    </div>
  );
}
