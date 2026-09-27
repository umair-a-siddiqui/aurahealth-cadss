import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aurahealth-cadss.vercel.app"),
  title: "AuraHealth CADSS",
  description:
    "AI-assisted clinical decision support for medicines, symptoms, lab reports, nutrition, metabolic health and blood compatibility.",
  openGraph: {
    title: "AuraHealth CADSS",
    description:
      "AI-assisted clinical decision support for medicines, symptoms, lab reports, nutrition, metabolic health and blood compatibility.",
    url: "https://aurahealth-cadss.vercel.app/",
    siteName: "AuraHealth CADSS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AuraHealth CADSS",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraHealth CADSS",
    description:
      "AI-assisted clinical decision support for medicines, symptoms, lab reports, nutrition, metabolic health and blood compatibility.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
