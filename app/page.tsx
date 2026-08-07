"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

const TARGET_SIZES = [
  { label: "50 KB", value: 50 },
  { label: "100 KB", value: 100 },
  { label: "200 KB", value: 200 },
  { label: "500 KB", value: 500 },
  { label: "1 MB", value: 1024 },
];

const TOOLS = [
  {
    icon: "📄",
    name: "PDF Merger",
    description: "Merge multiple PDF files into one PDF.",
    href: "/pdf-merger",
  },
  {
    icon: "🎵",
    name: "Video to MP3",
    description: "Convert your video files to MP3 audio.",
    href: "/audio-converter",
  },
  {
    icon: "🖼️",
    name: "Image to PDF",
    description: "Convert images into a PDF document.",
    href: "/image-to-pdf",
  },
  {
    icon: "🔳",
    name: "QR Code Generator",
    description: "Create QR codes quickly and easily.",
    href: "/qr-code",
  },
  {
    icon: "🪄",
    name: "Background Remover",
    description: "Remove image backgrounds easily.",
    href: "/background-remover",
  },
  {
    icon: "📸",
    name: "Passport Photo",
    description: "Create passport-size photos.",
    href: "/passport-photo",
  },
  {
    icon: "🗜️",
    name: "Image Compressor",
    description: "Compress images to your required KB size.",
    href: "#compressor",
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function createJpeg(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      "image/jpeg",
      quality
    );
  });
}

async function compressImage(
  file: File,
  targetKB: number
): Promise<Blob> {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Unable to read image."));
      image.src = objectUrl;
    });

    const targetBytes = targetKB * 1024;

    let width = image.naturalWidth;
    let height = image.naturalHeight;

    const maxDimension = 2400;

    if (Math.max(width, height) > maxDimension) {
      const scale =
        maxDimension / Math.max(width, height);

      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    let bestBlob: Blob | null = null;

    for (
      let dimensionAttempt = 0;
      dimensionAttempt < 7;
      dimensionAttempt++
    ) {
      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas is not supported.");
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(
        image,
        0,
        0,
        width,
        height
      );

      let low = 0.01;
      let high = 0.95;

      let bestForCanvas: Blob | null = null;

      for (let i = 0; i < 20; i++) {
        const quality = (low + high) / 2;

        const blob = await createJpeg(
          canvas,
          quality
        );

        if (!blob) {
          continue;
        }

        if (blob.size <= targetBytes) {
          bestForCanvas = blob;
          low = quality;
        } else {
          high = quality;
        }
      }

      if (bestForCanvas) {
        if (
          !bestBlob ||
          bestForCanvas.size > bestBlob.size
        ) {
          bestBlob = bestForCanvas;
        }

        const difference =
          targetBytes - bestForCanvas.size;

        const differencePercent =
          difference / targetBytes;

        if (differencePercent <= 0.08) {
          break;
        }
      }

      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);

      if (width < 320 || height < 320) {
        break;
      }
    }

    if (!bestBlob) {
      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas is not supported.");
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(
        image,
        0,
        0,
        width,
        height
      );

      const fallback = await createJpeg(
        canvas,
        0.01
      );

      if (!fallback) {
        throw new Error("Compression failed.");
      }

      bestBlob = fallback;
    }

    return bestBlob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function Home() {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [showWelcome, setShowWelcome] =
    useState(true);

  const [file, setFile] =
    useState<File | null>(null);

  const [targetKB, setTargetKB] =
    useState(200);

  const [customKB, setCustomKB] =
    useState("");

  const [result, setResult] =
    useState<Blob | null>(null);

  const [resultSize, setResultSize] =
    useState(0);

  const [isCompressing, setIsCompressing] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  function selectFile(
    selectedFile: File | undefined
  ) {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError(
        "Please select a JPG, PNG or WebP image."
      );
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setResultSize(0);
    setError("");
  }

  function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    selectFile(event.target.files?.[0]);
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setIsDragging(false);

    selectFile(
      event.dataTransfer.files?.[0]
    );
  }

  async function handleCompress() {
    if (!file) {
      setError(
        "Please choose an image first."
      );
      return;
    }

    if (
      !selectedKB ||
      selectedKB < 5 ||
      Number.isNaN(selectedKB)
    ) {
      setError(
        "Please enter a valid target size."
      );
      return;
    }

    setIsCompressing(true);
    setError("");
    setResult(null);
    setResultSize(0);

    try {
      const blob = await compressImage(
        file,
        selectedKB
      );

      setResult(blob);
      setResultSize(blob.size);
    } catch {
      setError(
        "Compression failed. Please try another image."
      );
    } finally {
      setIsCompressing(false);
    }
  }

  function downloadImage() {
    if (!result) {
      return;
    }

    const url =
      URL.createObjectURL(result);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `compressed-${
        file?.name.replace(/\.[^/.]+$/, "") ||
        "image"
      }.jpg`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  function reset() {
    setFile(null);
    setResult(null);
    setResultSize(0);
    setError("");
    setCustomKB("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const selectedKB = customKB
    ? Math.max(5, Number(customKB))
    : targetKB;

  const savedPercent =
    file && resultSize
      ? Math.max(
          0,
          Math.round(
            (1 - resultSize / file.size) *
              100
          )
        )
      : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9fc] text-[#211b2b]">

      <style jsx global>{`
        @keyframes welcomeIn {
          0% {
            opacity: 0;
            transform: scale(0.92);
          }

          35% {
            opacity: 1;
            transform: scale(1);
          }

          75% {
            opacity: 1;
            transform: scale(1);
          }

          100% {
            opacity: 0;
            transform: scale(1.04);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatIcon {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .welcome-animation {
          animation: welcomeIn 1s ease-in-out both;
        }

        .fade-up {
          animation: fadeUp 0.6s ease-out both;
        }

        .float-icon {
          animation: floatIcon 3s ease-in-out infinite;
        }

        .spinner {
          animation: spin 0.8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .welcome-animation,
          .fade-up,
          .float-icon,
          .spinner {
            animation: none !important;
          }
        }
      `}</style>

      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
          <div className="welcome-animation text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-violet-600 to-fuchsia-500 text-4xl font-black text-white shadow-2xl shadow-violet-200">
              K
            </div>

            <h1 className="mt-7 text-4xl font-black tracking-tight">
              Welcome to{" "}
              <span className="text-violet-600">
                ExactKB
              </span>
            </h1>

            <p className="mt-3 text-sm font-medium text-[#8a8192]">
              Fast • Private • Simple
            </p>

          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-[#ebe6f2] bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <a
            href="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg font-black text-white shadow-lg shadow-violet-200">
              K
            </div>

            <div>
              <div className="text-xl font-black">
                Exact
                <span className="text-violet-600">
                  KB
                </span>
              </div>

              <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#a29aaf] sm:block">
                Online Tools
              </div>
            </div>

          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#766d80] md:flex">

            <a
              href="#tools"
              className="transition hover:text-violet-600"
            >
              Tools
            </a>

            <a
              href="#compressor"
              className="transition hover:text-violet-600"
            >
              Image Compressor
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

      <section className="relative overflow-hidden px-5 pb-12 pt-16 sm:pt-20">

        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-violet-100/60 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">

          <div className="fade-up inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
            All Your Tools in One Place
          </div>

          <h1 className="fade-up mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">

            Powerful Online Tools

            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              Simple. Fast. Free.
            </span>

          </h1>

          <p className="fade-up mx-auto mt-6 max-w-2xl text-base leading-7 text-[#746b7d] sm:text-lg">
            Use ExactKB to merge PDFs, convert media,
            compress images and more — all from one place.
          </p>

        </div>

      </section>

      <section
        id="tools"
        className="px-5 pb-20"
      >

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              ExactKB Tools
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Choose a Tool
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#83798b]">
              Everything you need, available in one simple
              and easy-to-use website.
            </p>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {TOOLS.map((tool) => (
              <a
                key={tool.name}
                href={tool.href}
                className="group rounded-2xl border border-[#ebe5f0] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100"
              >

                <div className="flex items-start gap-4">

                  <div className="float-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
                    {tool.icon}
                  </div>

                  <div>

                    <h3 className="font-black transition group-hover:text-violet-600">
                      {tool.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#83798b]">
                      {tool.description}
                    </p>

                  </div>

                </div>

                <div className="mt-5 text-sm font-bold text-violet-600">
                  Open Tool →
                </div>

              </a>
            ))}

          </div>

        </div>

      </section>

      <section
        id="compressor"
        className="border-y border-[#ebe5f0] bg-white px-5 py-20"
      >

        <div className="mx-auto max-w-3xl">

          <div className="mb-10 text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              Featured Tool
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Image Compressor
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#83798b]">
              Compress JPG, PNG and WebP images to your
              required KB size.
            </p>

          </div>

          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">

            <div className="rounded-[24px] bg-[#fdfcff] p-5 sm:p-8">

              {!file ? (

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => {
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                  className={`rounded-2xl border-2 border-dashed px-5 py-16 text-center transition sm:py-20 ${
                    isDragging
                      ? "border-violet-500 bg-violet-50"
                      : "border-[#ddd5e7] bg-[#faf8fd] hover:border-violet-300"
                  }`}
                >

                  <div className="float-icon mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-4xl">
                    🖼️
                  </div>

                  <h2 className="mt-7 text-2xl font-black">
                    Upload your image
                  </h2>

                  <p className="mt-2 text-sm text-[#8a8192]">
                    Drag & drop your image here
                    <br />
                    or select one from your device
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mt-7 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-1"
                  >
                    Choose Image
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFile}
                    className="hidden"
                  />

                  <div className="mt-6 text-xs text-[#aaa1b2]">
                    JPG • PNG • WebP
                  </div>

                </div>

              ) : (

                <div>

                  <div className="flex flex-col gap-4 rounded-2xl border border-[#ebe5f1] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl">
                        📷
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-bold">
                          {file.name}
                        </p>

                        <p className="mt-1 text-sm text-[#918797]">
                          Original size:{" "}
                          {formatBytes(file.size)}
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-violet-50"
                    >
                      Change
                    </button>

                  </div>

                  <div className="mt-8">

                    <div className="flex items-center justify-between">

                      <label className="text-sm font-bold">
                        Target image size
                      </label>

                      <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-black text-violet-700">
                        {selectedKB} KB
                      </span>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">

                      {TARGET_SIZES.map((size) => (

                        <button
                          type="button"
                          key={size.value}
                          onClick={() => {
                            setTargetKB(size.value);
                            setCustomKB("");
                            setResult(null);
                          }}
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            !customKB &&
                            targetKB === size.value
                              ? "border-violet-500 bg-violet-600 text-white"
                              : "border-[#e5dfea] bg-white text-[#71677b] hover:border-violet-300"
                          }`}
                        >
                          {size.label}
                        </button>

                      ))}

                    </div>

                    <div className="mt-5">

                      <label className="mb-2 block text-sm font-bold">
                        Custom size
                      </label>

                      <div className="relative">

                        <input
                          type="number"
                          min="5"
                          value={customKB}
                          onChange={(event) => {
                            setCustomKB(
                              event.target.value
                            );
                            setResult(null);
                          }}
                          placeholder="Enter size, e.g. 150"
                          className="w-full rounded-xl border border-[#e2dce8] bg-white px-4 py-4 pr-16 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#aaa1b0]">
                          KB
                        </span>

                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {isCompressing && (
                      <span className="spinner h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
                    )}

                    {isCompressing
                      ? "Compressing your image..."
                      : `Compress Image to ${selectedKB} KB`}

                  </button>

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  {result && (
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

                      <div className="text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                          ✓
                        </div>

                        <h3 className="mt-4 text-xl font-black text-emerald-950">
                          Compression Complete
                        </h3>

                        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-5">

                          <div>
                            <p className="text-xs text-[#8d8492]">
                              Original
                            </p>

                            <p className="mt-1 font-black">
                              {formatBytes(file.size)}
                            </p>
                          </div>

                          <div className="text-xl text-[#b4abb9]">
                            →
                          </div>

                          <div>
                            <p className="text-xs text-[#8d8492]">
                              Compressed
                            </p>

                            <p className="mt-1 font-black text-emerald-600">
                              {formatBytes(resultSize)}
                            </p>
                          </div>

                        </div>

                        <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                          {savedPercent}% smaller
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={downloadImage}
                            className="mt-6 rounded-xl bg-emerald-600 px-8 py-3.5 font-black text-white shadow-lg"
                          >
                            Download Image
                          </button>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

      <section
        id="features"
        className="px-5 py-20"
      >

        <div className="mx-auto max-w-5xl">

          <div className="text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              Why ExactKB
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Simple, fast and private
            </h2>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">

            {[
              [
                "⚡",
                "Lightning Fast",
                "Use your tools quickly without complicated settings.",
              ],
              [
                "🔒",
                "Privacy Focused",
                "Many tools process files directly in your browser.",
              ],
              [
                "🎯",
                "Easy to Use",
                "Simple interfaces designed for everyone.",
              ],
            ].map(([icon, title, text]) => (

              <div
                key={title}
                className="rounded-2xl border border-[#ebe5f0] bg-white p-7 text-center transition hover:-translate-y-2 hover:shadow-xl"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                  {icon}
                </div>

                <h3 className="mt-5 font-black">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#83798b]">
                  {text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      <section
        id="how-it-works"
        className="border-y border-[#ebe5f0] bg-white px-5 py-20"
      >

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
            How It Works
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Use ExactKB in three steps
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">

            {[
              [
                "01",
                "Choose a Tool",
                "Select the tool you need from the tools section.",
              ],
              [
                "02",
                "Upload or Enter",
                "Add your file or enter the required information.",
              ],
              [
                "03",
                "Download",
                "Process your file and download the result.",
              ],
            ].map(([number, title, text]) => (

              <div key={number}>

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 font-black text-white">
                  {number}
                </div>

                <h3 className="mt-5 font-black">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#83798b]">
                  {text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      <section
        id="faq"
        className="px-5 py-20"
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

            <details className="rounded-2xl border border-[#ebe5f0] bg-white p-5">
              <summary className="cursor-pointer font-black">
                Is ExactKB free?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. ExactKB provides free online tools
                for common file and image tasks.
              </p>
            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-white p-5">
              <summary className="cursor-pointer font-black">
                What tools are available?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                PDF Merger, Video to MP3, Image to PDF,
                QR Code Generator, Background Remover,
                Passport Photo and Image Compressor.
              </p>
            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-white p-5">
              <summary className="cursor-pointer font-black">
                Do I need to create an account?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                No account is required to use the current
                tools.
              </p>
            </details>

          </div>

        </div>

      </section>

      <footer className="border-t border-[#ebe5f0] bg-[#faf9fc] px-5 py-12">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

            <div>

              <a
                href="/"
                className="text-2xl font-black"
              >
                Exact
                <span className="text-violet-600">
                  KB
                </span>
              </a>

              <p className="mt-4 max-w-xs text-sm leading-6 text-[#8d8492]">
                Free online tools for PDF, image, audio
                and everyday file tasks.
              </p>

            </div>

            <div>

              <h3 className="text-sm font-black">
                Tools
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/pdf-merger"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  PDF Merger
                </a>

                <a
                  href="/audio-converter"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Video to MP3
                </a>

                <a
                  href="/image-to-pdf"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Image to PDF
                </a>

                <a
                  href="/qr-code"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  QR Code Generator
                </a>

                <a
                  href="/background-remover"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Background Remover
                </a>

                <a
                  href="/passport-photo"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Passport Photo
                </a>

              </div>

            </div>

            <div>

              <h3 className="text-sm font-black">
                Company
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/about"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  About
                </a>

                <a
                  href="/contact"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Contact
                </a>

              </div>

            </div>

            <div>

              <h3 className="text-sm font-black">
                Legal
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/privacy-policy"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Privacy Policy
                </a>

                <a
                  href="/terms"
                  className="block text-[#817787] hover:text-violet-600"
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