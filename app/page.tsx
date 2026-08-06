"use client";

import { ChangeEvent, useRef, useState } from "react";

const TARGET_SIZES = [
  { label: "50 KB", value: 50 },
  { label: "100 KB", value: 100 },
  { label: "200 KB", value: 200 },
  { label: "500 KB", value: 500 },
  { label: "1 MB", value: 1024 },
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

      image.onerror = () => {
        reject(new Error("Unable to read image."));
      };

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

    selectFile(event.dataTransfer.files?.[0]);
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
            (1 - resultSize / file.size) * 100
          )
        )
      : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9fc] text-[#211b2b]">

      {/* ANIMATION STYLES */}

      <style jsx global>{`
        @keyframes exactFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes exactFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes exactFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes exactGlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.55;
          }

          50% {
            transform: scale(1.12);
            opacity: 0.8;
          }
        }

        @keyframes exactSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes exactResult {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .exact-fade-up {
          animation: exactFadeUp 0.7s ease-out both;
        }

        .exact-fade-up-delay-1 {
          animation: exactFadeUp 0.7s 0.12s ease-out both;
        }

        .exact-fade-up-delay-2 {
          animation: exactFadeUp 0.7s 0.24s ease-out both;
        }

        .exact-fade-in {
          animation: exactFadeIn 0.8s ease-out both;
        }

        .exact-float {
          animation: exactFloat 3s ease-in-out infinite;
        }

        .exact-glow {
          animation: exactGlow 5s ease-in-out infinite;
        }

        .exact-result {
          animation: exactResult 0.5s ease-out both;
        }

        .exact-spinner {
          animation: exactSpin 0.9s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .exact-fade-up,
          .exact-fade-up-delay-1,
          .exact-fade-up-delay-2,
          .exact-fade-in,
          .exact-float,
          .exact-glow,
          .exact-result,
          .exact-spinner {
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
                Image Compressor
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

      <section className="relative overflow-hidden px-5 pb-10 pt-16 sm:pt-24">

        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-[100px] exact-glow" />

        <div className="pointer-events-none absolute left-[10%] top-32 -z-0 h-32 w-32 rounded-full bg-fuchsia-100/60 blur-3xl exact-glow" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">

          <div className="exact-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">

            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />

            Fast • Private • Simple

          </div>

          <h1 className="exact-fade-up-delay-1 text-4xl font-black leading-tight tracking-tight sm:text-6xl">

            Compress Images to

            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">

              the Exact Size You Need

            </span>

          </h1>

          <p className="exact-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-base leading-7 text-[#746b7d] sm:text-lg">

            Reduce JPG, PNG and WebP images to your required
            KB size. No registration, no software installation,
            and no complicated settings.

          </p>

        </div>

      </section>


      {/* COMPRESSOR */}

      <section className="relative z-10 px-5 pb-24">

        <div className="mx-auto max-w-3xl">

          <div className="exact-fade-up-delay-2 rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)] transition duration-500 hover:shadow-[0_30px_100px_rgba(83,53,112,0.18)]">

            <div className="rounded-[24px] border border-[#eee9f4] bg-[#fdfcff] p-5 sm:p-8">

              {!file ? (

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() =>
                    setIsDragging(false)
                  }
                  onDrop={handleDrop}
                  className={`rounded-2xl border-2 border-dashed px-5 py-16 text-center transition duration-300 sm:py-20 ${
                    isDragging
                      ? "scale-[1.01] border-violet-500 bg-violet-50"
                      : "border-[#ddd5e7] bg-[#faf8fd] hover:border-violet-300 hover:bg-violet-50/50"
                  }`}
                >

                  <div className="exact-float mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-4xl shadow-inner">
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
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mt-7 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-bold text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
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

                  <div className="mt-6 flex items-center justify-center gap-3 text-xs text-[#aaa1b2]">

                    <span>JPG</span>
                    <span>•</span>
                    <span>PNG</span>
                    <span>•</span>
                    <span>WebP</span>

                  </div>

                </div>

              ) : (

                <div>

                  {/* FILE */}

                  <div className="flex flex-col gap-4 rounded-2xl border border-[#ebe5f1] bg-white p-4 shadow-sm transition duration-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="exact-float flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl">
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
                      onClick={reset}
                      className="rounded-lg border border-[#e5dfea] bg-white px-4 py-2 text-sm font-semibold text-[#6f6578] transition duration-300 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                      Change
                    </button>

                  </div>


                  {/* TARGET */}

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
                          key={size.value}
                          onClick={() => {
                            setTargetKB(size.value);
                            setCustomKB("");
                            setResult(null);
                          }}
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${
                            !customKB &&
                            targetKB === size.value
                              ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200"
                              : "border-[#e5dfea] bg-white text-[#71677b] hover:border-violet-300 hover:text-violet-700"
                          }`}
                        >
                          {size.label}
                        </button>

                      ))}

                    </div>


                    <div className="mt-5">

                      <label className="mb-2 block text-sm font-bold text-[#6e6477]">
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
                          className="w-full rounded-xl border border-[#e2dce8] bg-white px-4 py-4 pr-16 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />

                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#aaa1b0]">
                          KB
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* BUTTON */}

                  <button
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl shadow-violet-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {isCompressing && (
                      <span className="exact-spinner h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
                    )}

                    {isCompressing
                      ? "Compressing your image..."
                      : `Compress Image to ${selectedKB} KB`}

                  </button>


                  {/* ERROR */}

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                      {error}
                    </div>
                  )}


                  {/* RESULT */}

                  {result && (

                    <div className="exact-result mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

                      <div className="text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                          ✓
                        </div>

                        <h3 className="mt-4 text-xl font-black text-emerald-950">
                          Compression Complete
                        </h3>

                        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-5">

                          <div>

                            <p className="text-xs font-semibold text-[#8d8492]">
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

                            <p className="text-xs font-semibold text-[#8d8492]">
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
                            onClick={downloadImage}
                            className="mt-6 rounded-xl bg-emerald-600 px-8 py-3.5 font-black text-white shadow-lg shadow-emerald-200 transition duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]"
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


      {/* FEATURES */}

      <section
        id="features"
        className="border-y border-[#ebe5f0] bg-white px-5 py-20"
      >

        <div className="mx-auto max-w-5xl">

          <div className="mx-auto max-w-2xl text-center exact-fade-up">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              Why ExactKB
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Simple, fast and private
            </h2>

            <p className="mt-4 text-[#83798b]">
              Everything you need to reduce image size
              without unnecessary complexity.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">

            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                text: "Your image is compressed directly in your browser.",
              },
              {
                icon: "🔒",
                title: "Private by Design",
                text: "Your image stays on your device during browser-based compression.",
              },
              {
                icon: "🎯",
                title: "Choose Your Size",
                text: "Select a preset target or enter your own custom KB size.",
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
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Compress in three simple steps
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">

            {[
              [
                "01",
                "Upload",
                "Choose the image you want to compress.",
              ],
              [
                "02",
                "Choose Size",
                "Select your required KB target.",
              ],
              [
                "03",
                "Download",
                "Download your compressed image instantly.",
              ],
            ].map(
              ([number, title, description]) => (

                <div
                  key={number}
                  className="group transition duration-300 hover:-translate-y-2"
                >

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 font-black text-white shadow-lg shadow-violet-200 transition duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    {number}
                  </div>

                  <h3 className="mt-5 font-black">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#83798b]">
                    {description}
                  </p>

                </div>

              )
            )}

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

            <details className="group rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5 transition hover:border-violet-200">

              <summary className="cursor-pointer list-none font-black">
                Is ExactKB free?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. ExactKB is designed as a free
                image compression tool.
              </p>

            </details>


            <details className="group rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5 transition hover:border-violet-200">

              <summary className="cursor-pointer list-none font-black">
                Are my images uploaded to a server?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                No. The current compression process
                runs directly in your browser.
              </p>

            </details>


            <details className="group rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5 transition hover:border-violet-200">

              <summary className="cursor-pointer list-none font-black">
                What image formats are supported?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                JPG, JPEG, PNG and WebP images
                are supported.
              </p>

            </details>


            <details className="group rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5 transition hover:border-violet-200">

              <summary className="cursor-pointer list-none font-black">
                Can I choose a custom KB size?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. Enter your preferred target
                size in the custom KB field.
              </p>

            </details>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-[#ebe5f0] bg-[#faf9fc] px-5 py-12">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

            <div>

              <a
                href="/"
                className="text-2xl font-black tracking-tight"
              >
                Exact<span className="text-violet-600">KB</span>
              </a>

              <p className="mt-4 max-w-xs text-sm leading-6 text-[#8d8492]">
                Compress JPG, PNG and WebP images to the
                size you need. Fast, simple and private.
              </p>

            </div>


            <div>

              <h3 className="text-sm font-black">
                Tool
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  Image Compressor
                </a>

                <a
                  href="#how-it-works"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  How It Works
                </a>

                <a
                  href="#features"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  Features
                </a>

                <a
                  href="#faq"
                  className="block text-[#817787] transition hover:text-violet-600"
                >
                  FAQ
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