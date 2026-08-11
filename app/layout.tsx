import type { Metadata } from "next";
import Script from "next/script";
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
      <body>
        {children}

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8535461702596029"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* PWA Service Worker */}
        <Script
          id="register-service-worker"
          strategy="afterInteractive"
        >
          {`
            if ("serviceWorker" in navigator) {
              window.addEventListener("load", function () {
                navigator.serviceWorker
                  .register("/sw.js")
                  .then(function (registration) {
                    console.log(
                      "ExactKB Service Worker registered:",
                      registration.scope
                    );
                  })
                  .catch(function (error) {
                    console.error(
                      "ExactKB Service Worker registration failed:",
                      error
                    );
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}