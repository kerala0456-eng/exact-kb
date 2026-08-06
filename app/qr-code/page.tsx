"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function QRCodePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [text, setText] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateQR() {
    const value = text.trim();

    if (!value) {
      setError("Please enter text or a URL first.");
      setQrGenerated(false);
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      await QRCode.toCanvas(canvasRef.current, value, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: "M",
        color: {
          dark: "#211b2b",
          light: "#ffffff",
        },
      });

      setQrGenerated(true);
    } catch {
      setError("Unable to generate QR code. Please try again.");
      setQrGenerated(false);
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadQR() {
    const canvas = canvasRef.current;

    if (!canvas || !qrGenerated) {
      return;
    }

    const link = document.createElement("a");

    link.download = "exactkb-qr-code.png";
    link.href = canvas.toDataURL("image/png");

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function copyText() {
    if (!text.trim()) {
      setError("There is nothing to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError("Unable to copy text.");
    }
  }

  function clearAll() {
    setText("");
    setError("");
    setQrGenerated(false);

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  useEffect(() => {
    if (!text.trim()) {
      setQrGenerated(false);
    }
  }, [text]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9fc] text-[#211b2b]">

      {/* ANIMATION */}

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
            opacity: 0.45;
          }

          50% {
            transform: scale(1.12);
            opacity: 0.75;
          }
        }

        @keyframes qrSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes qrResult {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(15px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .qr-fade-up {
          animation: qrFadeUp 0.7s ease-out both;
        }

        .qr-fade-delay {
          animation: qrFadeUp 0.7s 0.15s ease-out both;
        }

        .qr-float {
          animation: qrFloat 3s ease-in-out infinite;
        }

        .qr-glow {
          animation: qrGlow 5s ease-in-out infinite;
        }

        .qr-result {
          animation: qrResult 0.5s ease-out both;
        }

        .qr-spinner {
          animation: qrSpin 0.8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .qr-fade-up,
          .qr-fade-delay,
          .qr-float,
          .qr-glow,
          .qr-result,
          .qr-spinner {
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
              href="#features"
              className="transition hover:text-violet-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-violet-600"
            >
              How It Works
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

        <div className="pointer-events-none absolute left-[10%] top-40 -z-0 h-32 w-32 rounded-full bg-fuchsia-100/60 blur-3xl qr-glow" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">

          <div className="qr-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">

            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />

            Fast • Free • Private

          </div>

          <h1 className="qr-fade-up text-4xl font-black leading-tight tracking-tight sm:text-6xl">

            Generate QR Codes

            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              Instantly & Easily
            </span>

          </h1>

          <p className="qr-fade-delay mx-auto mt-6 max-w-2xl text-base leading-7 text-[#746b7d] sm:text-lg">

            Create a free QR code from any text, website URL,
            contact information or message. Generate and
            download your QR code instantly.

          </p>

        </div>

      </section>

      {/* QR GENERATOR */}

      <section className="relative z-10 px-5 pb-24">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">

            <div className="rounded-[24px] border border-[#eee9f4] bg-[#fdfcff] p-5 sm:p-8">

              <div className="grid gap-8 md:grid-cols-2">

                {/* INPUT */}

                <div>

                  <div className="mb-5">

                    <div className="mb-2 flex items-center justify-between">

                      <label className="text-sm font-black">
                        Enter text or URL
                      </label>

                      <span className="text-xs font-semibold text-[#aaa1b0]">
                        {text.length}/2000
                      </span>

                    </div>

                    <textarea
                      value={text}
                      maxLength={2000}
                      onChange={(event) => {
                        setText(event.target.value);
                        setError("");
                        setQrGenerated(false);
                      }}
                      placeholder="https://example.com"
                      rows={8}
                      className="w-full resize-none rounded-2xl border border-[#e2dce8] bg-white px-4 py-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    />

                  </div>

                  {/* QUICK EXAMPLES */}

                  <div className="mb-6">

                    <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#94899c]">
                      Quick examples
                    </p>

                    <div className="flex flex-wrap gap-2">

                      <button
                        onClick={() => {
                          setText("https://www.google.com");
                          setQrGenerated(false);
                          setError("");
                        }}
                        className="rounded-lg border border-[#e5dfea] bg-white px-3 py-2 text-xs font-bold text-[#71677b] transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                      >
                        Website
                      </button>

                      <button
                        onClick={() => {
                          setText("Hello from ExactKB!");
                          setQrGenerated(false);
                          setError("");
                        }}
                        className="rounded-lg border border-[#e5dfea] bg-white px-3 py-2 text-xs font-bold text-[#71677b] transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                      >
                        Text
                      </button>

                      <button
                        onClick={() => {
                          setText("Contact ExactKB");
                          setQrGenerated(false);
                          setError("");
                        }}
                        className="rounded-lg border border-[#e5dfea] bg-white px-3 py-2 text-xs font-bold text-[#71677b] transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                      >
                        Message
                      </button>

                    </div>

                  </div>

                  {/* BUTTONS */}

                  <button
                    onClick={generateQR}
                    disabled={isGenerating}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl shadow-violet-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {isGenerating && (
                      <span className="qr-spinner h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
                    )}

                    {isGenerating
                      ? "Generating..."
                      : "Generate QR Code"}

                  </button>

                  <button
                    onClick={clearAll}
                    className="mt-3 w-full rounded-xl border border-[#e3dce8] bg-white px-6 py-3.5 font-bold text-[#71677b] transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                  >
                    Clear
                  </button>

                  {error && (

                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                      {error}
                    </div>

                  )}

                </div>

                {/* QR PREVIEW */}

                <div className="flex flex-col items-center justify-center rounded-2xl border border-[#ebe5f1] bg-white p-6">

                  <p className="text-sm font-black">
                    Your QR Code
                  </p>

                  <p className="mt-1 text-xs text-[#918797]">
                    Scan with your phone camera
                  </p>

                  <div
                    className={`mt-6 flex min-h-[340px] w-full items-center justify-center rounded-2xl border-2 border-dashed border-[#e5dfea] bg-[#faf9fd] p-4 ${
                      qrGenerated ? "qr-result" : ""
                    }`}
                  >

                    {!qrGenerated ? (

                      <div className="text-center">

                        <div className="qr-float mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-5xl shadow-inner">
                          ▦
                        </div>

                        <p className="mt-5 font-bold text-[#71677b]">
                          Your QR code will appear here
                        </p>

                        <p className="mt-2 text-xs text-[#a29aaf]">
                          Enter something and click Generate
                        </p>

                      </div>

                    ) : (

                      <div className="text-center">

                        <div className="rounded-2xl bg-white p-3 shadow-lg">

                          <canvas
                            ref={canvasRef}
                            className="mx-auto max-w-full"
                          />

                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                          <button
                            onClick={downloadQR}
                            className="rounded-xl bg-emerald-600 px-6 py-3.5 font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-1 hover:bg-emerald-700"
                          >
                            Download PNG
                          </button>

                          <button
                            onClick={copyText}
                            className="rounded-xl border border-[#e2dce8] bg-white px-6 py-3.5 font-bold text-[#71677b] transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                          >
                            Copy Text
                          </button>

                        </div>

                      </div>

                    )}

                  </div>

                </div>

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
              A simple QR code generator
            </h2>

            <p className="mt-4 text-[#83798b]">
              Create QR codes without registration,
              complicated settings or unnecessary steps.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">

            {[
              {
                icon: "⚡",
                title: "Instant Generation",
                text: "Generate a QR code within seconds directly in your browser.",
              },
              {
                icon: "🔒",
                title: "Private",
                text: "Your text and URLs are processed locally in your browser.",
              },
              {
                icon: "📥",
                title: "Easy Download",
                text: "Download your generated QR code as a high-quality PNG image.",
              },
            ].map((feature) => (

              <div
                key={feature.title}
                className="group rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl transition duration-300 group-hover:scale-110">
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
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Create your QR code in 3 steps
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">

            {[
              [
                "01",
                "Enter Content",
                "Enter a URL, text or message.",
              ],
              [
                "02",
                "Generate",
                "Click the Generate QR Code button.",
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

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5">

              <summary className="cursor-pointer list-none font-black">
                Is the QR code generator free?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. You can create and download QR codes
                for free using ExactKB.
              </p>

            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5">

              <summary className="cursor-pointer list-none font-black">
                What can I put inside a QR code?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                You can encode website URLs, text, messages,
                contact information and other supported text content.
              </p>

            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5">

              <summary className="cursor-pointer list-none font-black">
                Are my QR code contents uploaded?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                The QR code is generated directly in your browser.
                Your entered content is not required to be uploaded
                to a server.
              </p>

            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5">

              <summary className="cursor-pointer list-none font-black">
                Can I download the QR code?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. After generating the QR code, click
                Download PNG to save it to your device.
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
                Free online tools for image compression,
                QR code generation and more.
              </p>

            </div>

            {/* TOOLS */}

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
              Fast • Free • Private
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}