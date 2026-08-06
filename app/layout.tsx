import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExactKB – Compress Image to Exact KB Size",
  description:
    "Free online image compressor. Compress JPG, PNG and WebP images to your required KB size quickly and privately.",
  keywords: [
    "image compressor",
    "compress image to 100kb",
    "compress image to exact kb",
    "jpg compressor",
    "png compressor",
    "webp compressor",
    "image compressor online",
  ],
  authors: [
    {
      name: "ExactKB",
    },
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ExactKB – Compress Image to Exact KB Size",
    description:
      "Compress JPG, PNG and WebP images to your required KB size.",
    type: "website",
  },
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