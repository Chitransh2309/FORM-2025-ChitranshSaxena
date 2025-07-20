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
  title: "FormSpace",
  description: "Forms that fit every space.",
  openGraph: {
    title: "FormSpace",
    description: "Forms that fit every space.",
    url: "https://form-2025.vercel.app/", // Replace with your actual URL
    siteName: "FormSpace",
    images: [
      {
        url: "/logoform.png", // Make sure this image exists in /public
        width: 1200,
        height: 630,
        alt: "FormSpace preview image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FormSpace",
    description: "Forms that fit every space.",
    images: ["/logoform.png"], // Ensure this image is accessible
  },
  icons: {
    icon: "/logoform.png", // Add this line for the favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
