import type { Metadata } from "next";
import { Geist, Playfair_Display, Great_Vibes } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tabitha & Babajide | Wedding",
  description:
    "Share and view photos from the wedding of Tabitha Jonah Mark & Babajide Emmanuel Fakile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} ${greatVibes.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream text-charcoal">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
