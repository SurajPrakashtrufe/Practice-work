import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: {
    default: "Quick Blood — Save Lives, One Drop at a Time",
    template: "%s | Quick Blood",
  },
  description: "Connect blood donors with patients and hospitals in real time. Register, request blood, or manage your hospital — all in one place.",
  keywords: ["blood donation", "blood bank", "donor", "quick blood", "emergency blood", "India"],
  metadataBase: new URL("https://quickblood.in"),
  openGraph: {
    title: "Quick Blood",
    description: "Real-time blood donor matching for India.",
    siteName: "Quick Blood",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Blood",
    description: "Real-time blood donor matching for India.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quick Blood",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
