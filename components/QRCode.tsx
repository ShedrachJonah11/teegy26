"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function QRCode() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/upload`);
  }, []);

  if (!url) return null;

  return (
    <div className="inline-flex flex-col items-center gap-2.5 bg-white rounded-lg p-4 shadow-sm">
      <QRCodeSVG
        value={url}
        size={100}
        bgColor="#ffffff"
        fgColor="#1e1e1e"
        level="M"
      />
      <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
        Scan to upload
      </p>
    </div>
  );
}
