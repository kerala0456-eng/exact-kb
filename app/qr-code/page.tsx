"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type QrSize = 256 | 512 | 1024;

export default function QRCodePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [text, setText] = useState("");
  const [qrSize, setQrSize] = useState<QrSize>(512);
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  async function generateQR() {
    if (!text.trim()) {
      setError("Please enter a URL or text first.");
      setGenerated(false);
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    try {
      setError("");

      await QRCode.toCanvas(canvas, text.trim(), {
        width: qrSize,
        margin: 3,
        errorCorrectionLevel: "H",
        color: {
          dark: foreground,
          light: background,
        },
      });

      setGenerated(true);
    } catch {
      setError("Unable to generate QR code. Please try again.");
      setGenerated(false);
    }
  }

  useEffect(() => {
    if (text.trim()) {
      generateQR();
    }
  }, [qrSize, foreground, background]);

  function downloadQR() {
    const canvas = canvasRef.current;

    if (!canvas || !generated) {
      return;
    }

    const link = document.createElement("a");

    link.download = "exactkb-qr-code.png";
    link.href = canvas.toDataURL("image/png");

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function clearAll() {
    setText("");
    setError("");
    setGenerated(false);

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9fc] text-[#211b2b]">

      {/* ANIMATIONS */}

      <style jsx global>{`
        @keyframes qrFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes qrFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes qrGlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }

          50% {
            transform: scale(1.12);
            opacity: 0.8;
          }
        }

        @keyframes qrPop {
          from {
            opacity: 0;
            transform: scale(0.92);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .qr-fade-up {
          animation: qrFadeUp 0.7s ease-out both;
        }

        .qr-delay-1 {
          animation-delay: 0.12s;
        }

        .qr-delay-2 {
          animation-delay: 0.24s;
        }

        .qr-float {
          animation: qrFloat 3s ease-in-out infinite;
        }

        .qr-glow {
          animation: qrGlow 5s ease-in-out infinite;
        }

        .qr-pop {
          animation: qrPop 0.45s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .qr-fade-up,
          .qr-float,
          .qr-glow,
          .qr-pop {
            animation: none !important;
          }
        }
      `}</style>

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-[#ebe6f2] bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <a
            href="/"
            className="flex items-center gap-3 transition hover:scale-[1.02]"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg font-black text-white shadow-lg shadow-violet-200">
              K
            </div>

            <div>

              <div className="text-xl font-black tracking-tight">
                Exact
                <span className="text-violet-600">
                  KB
                </span>
              </div>

              <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#a29aaf] sm:block">
                QR Code Generator
              </div>

            </div>

          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#766d80] md:flex">

            <a
              href="#how-it-works"
              className="transition hover:text-violet-600"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="transition hover:text-violet-600"
            >
              Features
            </a>

            <a
              href="#faq"
              className="transition hover:text-violet-600"
            >
              FAQ
            </a>

          </nav>

          <div className="rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            Free Forever
          </div>

        </div>

      </header>

      {/* HERO */}

      <section className="relative overflow-hidden px-5 pb-12 pt-16 sm:pt-24">

        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-[100px] qr-glow" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">

          <div className="qr-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">

            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />

            Fast • Private • Free

          </div>

          <h1 className="qr-fade-up qr-delay-1 text-4xl font-black leading-tight tracking-tight sm:text-6xl">

            Create a QR Code

            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              in Seconds
            </span>

          </h1>

          <p className="qr-fade-up qr-delay-2 mx-auto mt-6 max-w-2xl text-base leading-7 text-[#746b7d] sm:text-lg">

            Generate a free QR code for websites, text,
            links and more. Customize the colors and
            download your QR code instantly.

          </p>

        </div>

      </section>

      {/* QR TOOL */}

      <section className="relative z-10 px-5 pb-24">

        <div className="mx-auto max-w-5xl">

          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">

            <div className="grid gap-8 rounded-[24px] border border-[#eee9f4] bg-[#fdfcff] p-5 sm:p-8 lg:grid-cols-2">

              {/* LEFT */}

              <div>

                <div>

                  <label className="text-sm font-black">
                    Enter URL or text
                  </label>

                  <textarea
                    value={text}
                    onChange={(event) => {
                      setText(event.target.value);
                      setError("");
                      setGenerated(false);
                    }}
                    placeholder="https://example.com"
                    rows={5}
                    className="mt-3 w-full resize-none rounded-2xl border border-[#e2dce8] bg-white px-4 py-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />

                  <p className="mt-2 text-xs text-[#968c9d]">
                    Enter a website URL, message or any text
                    you want to encode.
                  </p>

                </div>

                {/* SIZE */}

                <div className="mt-7">

                  <label className="text-sm font-black">
                    QR Code Size
                  </label>

                  <div className="mt-3 grid grid-cols-3 gap-3">

                    {[
                      {
                        label: "Small",
                        value: 256 as QrSize,
                      },
                      {
                        label: "Medium",
                        value: 512 as QrSize,
                      },
                      {
                        label: "Large",
                        value: 1024 as QrSize,
                      },
                    ].map((size) => (

                      <button
                        key={size.value}
                        onClick={() => setQrSize(size.value)}
                        className={`rounded-xl border px-3 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                          qrSize === size.value
                            ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200"
                            : "border-[#e5dfea] bg-white text-[#71677b] hover:border-violet-300"
                        }`}
                      >
                        {size.label}
                      </button>

                    ))}

                  </div>

                </div>

                {/* COLORS */}

                <div className="mt-7">

                  <label className="text-sm font-black">
                    QR Code Colors
                  </label>

                  <div className="mt-3 grid grid-cols-2 gap-4">

                    <div>

                      <label className="mb-2 block text-xs font-semibold text-[#817787]">
                        Foreground
                      </label>

                      <div className="flex items-center gap-3 rounded-xl border border-[#e5dfea] bg-white p-3">

                        <input
                          type="color"
                          value={foreground}
                          onChange={(event) =>
                            setForeground(event.target.value)
                          }
                          className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                        />

                        <span className="text-sm font-bold">
                          {foreground}
                        </span>

                      </div>

                    </div>

                    <div>

                      <label className="mb-2 block text-xs font-semibold text-[#817787]">
                        Background
                      </label>

                      <div className="flex items-center gap-3 rounded-xl border border-[#e5dfea] bg-white p-3">

                        <input
                          type="color"
                          value={background}
                          onChange={(event) =>
                            setBackground(event.target.value)
                          }
                          className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                        />

                        <span className="text-sm font-bold">
                          {background}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

                {/* GENERATE */}

                <button
                  onClick={generateQR}
                  className="mt-8 w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98]"
                >
                  Generate QR Code
                </button>

                {error && (

                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                    {error}
                  </div>

                )}

              </div>

              {/* RIGHT */}

              <div className="flex flex-col items-center justify-center rounded-3xl border border-[#ebe5f1] bg-white p-6 shadow-sm sm:p-10">

                <div className="text-center">

                  <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
                    Preview
                  </p>

                  <h2 className="mt-2 text-xl font-black">
                    Your QR Code
                  </h2>

                </div>

                <div className="qr-float mt-8 flex min-h-[280px] w-full items-center justify-center rounded-3xl border border-[#eee9f4] bg-[#faf8fd] p-5">

                  {!generated ? (

                    <div className="text-center">

                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-4xl">
                        ▦
                      </div>

                      <p className="mt-5 text-sm font-semibold text-[#93899b]">
                        Your QR code will appear here
                      </p>

                    </div>

                  ) : (

                    <div className="qr-pop rounded-2xl bg-white p-3 shadow-lg">

                      <canvas
                        ref={canvasRef}
                        className="h-auto max-w-full"
                        style={{
                          width: "100%",
                          maxWidth: "320px",
                        }}
                      />

                    </div>

                  )}

                </div>

                {generated && (

                  <button
                    onClick={downloadQR}
                    className="qr-pop mt-7 w-full rounded-xl bg-emerald-600 px-6 py-4 font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]"
                  >
                    Download QR Code
                  </button>

                )}

                {generated && (

                  <button
                    onClick={clearAll}
                    className="mt-3 text-sm font-bold text-[#817787] transition hover:text-violet-600"
                  >
                    Create Another QR Code
                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="border-y border-[#ebe5f0] bg-white px-5 py-20"
      >

        <div className="mx-auto max-w-5xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              Why ExactKB
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              A simple QR generator
            </h2>

            <p className="mt-4 text-[#83798b]">
              Create and download QR codes without
              complicated settings or registration.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">

            {[
              {
                icon: "⚡",
                title: "Instant Generation",
                text: "Create QR codes quickly directly in your browser.",
              },
              {
                icon: "🔒",
                title: "Private",
                text: "Your entered content is processed directly in your browser.",
              },
              {
                icon: "🎨",
                title: "Customizable",
                text: "Choose QR size and foreground and background colors.",
              },
            ].map((feature) => (

              <div
                key={feature.title}
                className="group rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl transition duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>

                <h3 className="mt-5 font-black">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#83798b]">
                  {feature.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section
        id="how-it-works"
        className="px-5 py-20"
      >

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
            How It Works
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Create a QR code in three steps
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">

            {[
              [
                "01",
                "Enter Content",
                "Enter your URL, text or message.",
              ],
              [
                "02",
                "Generate",
                "Click the generate button to create your QR code.",
              ],
              [
                "03",
                "Download",
                "Download your QR code as a PNG image.",
              ],
            ].map(([number, title, description]) => (

              <div
                key={number}
                className="group transition duration-300 hover:-translate-y-2"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 font-black text-white shadow-lg shadow-violet-200 transition group-hover:scale-110">
                  {number}
                </div>

                <h3 className="mt-5 font-black">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#83798b]">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FAQ */}

      <section
        id="faq"
        className="border-t border-[#ebe5f0] bg-white px-5 py-20"
      >

        <div className="mx-auto max-w-3xl">

          <div className="text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Frequently Asked Questions
            </h2>

          </div>

          <div className="mt-10 space-y-4">

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5 transition hover:border-violet-200">

              <summary className="cursor-pointer list-none font-black">
                Is the QR Code Generator free?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. ExactKB QR Code Generator is free
                to use without registration.
              </p>

            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5 transition hover:border-violet-200">

              <summary className="cursor-pointer list-none font-black">
                What can I use a QR code for?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                You can create QR codes for websites,
                URLs, text, messages and other information.
              </p>

            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5 transition hover:border-violet-200">

              <summary className="cursor-pointer list-none font-black">
                Can I customize the QR code?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. You can select the QR code size,
                foreground color and background color.
              </p>

            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5 transition hover:border-violet-200">

              <summary className="cursor-pointer list-none font-black">
                Can I download the QR code?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. Generated QR codes can be downloaded
                as PNG images.
              </p>

            </details>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-[#ebe5f0] bg-[#faf9fc] px-5 py-12">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

            {/* BRAND */}

            <div>

              <a
                href="/"
                className="text-2xl font-black tracking-tight"
              >
                Exact
                <span className="text-violet-600">
                  KB
                </span>
              </a>

              <p className="mt-4 max-w-xs text-sm leading-6 text-[#8d8492]">
                Free online tools for images,
                QR codes and more.
              </p>

            </div>

            {/* TOOL */}

            <div>

              <h3 className="text-sm font-black">
                Tools
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  Image Compressor
                </a>

                <a
                  href="/passport-photo"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  Passport Photo
                </a>

                <a
                  href="/qr-code"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  QR Code Generator
                </a>

              </div>

            </div>

            {/* COMPANY */}

            <div>

              <h3 className="text-sm font-black">
                Company
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/about"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  About
                </a>

                <a
                  href="/contact"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  Contact
                </a>

              </div>

            </div>

            {/* LEGAL */}

            <div>

              <h3 className="text-sm font-black">
                Legal
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/privacy-policy"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  Privacy Policy
                </a>

                <a
                  href="/terms"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  Terms of Service
                </a>

              </div>

            </div>

          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[#e8e2ed] pt-6 text-sm text-[#968c9d] sm:flex-row sm:items-center sm:justify-between">

            <p>
              © 2026 ExactKB. All rights reserved.
            </p>

            <p>
              Fast • Private • Simple
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}