import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://exact-kb-ten.vercel.app"),

  title: {
    default: "ExactKB – Compress Images to Exact KB Size",
    template: "%s | ExactKB",
  },

  description:
    "ExactKB is a free online image compressor that helps you reduce JPG, PNG and WebP images to a target KB size. Choose a preset size or enter a custom target.",

  keywords: [
    "image compressor",
    "compress image",
    "compress image to 50kb",
    "compress image to 100kb",
    "compress image to 200kb",
    "compress image to 500kb",
    "compress image to 1mb",
    "compress image to exact kb",
    "reduce image size",
    "jpg compressor",
    "png compressor",
    "webp compressor",
    "compress jpg online",
    "compress png online",
    "compress webp online",
    "image compressor online",
  ],

  authors: [
    {
      name: "ExactKB",
    },
  ],

  creator: "ExactKB",
  publisher: "ExactKB",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://exact-kb-ten.vercel.app/",
  },

  openGraph: {
    title: "ExactKB – Compress Images to Exact KB Size",
    description:
      "Compress JPG, PNG and WebP images to a target KB size with ExactKB.",
    url: "https://exact-kb-ten.vercel.app/",
    siteName: "ExactKB",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "ExactKB – Compress Images to Exact KB Size",
    description:
      "Free online image compressor for JPG, PNG and WebP images.",
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}