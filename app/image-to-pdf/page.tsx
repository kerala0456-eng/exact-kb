"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";
import jsPDF from "jspdf";

type ImageItem = {
  id: string;
  file: File;
  url: string;
};

type PageSize = "a4" | "letter";
type Orientation = "portrait" | "landscape";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageToPDF() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] =
    useState<Orientation>("portrait");

  const [isDragging, setIsDragging] =
    useState(false);

  const [isCreating, setIsCreating] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function addImages(files: FileList | File[]) {
    const selectedFiles = Array.from(files);

    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(
        file.type
      )
    );

    if (validFiles.length === 0) {
      setError(
        "Please select JPG, PNG or WebP images."
      );
      return;
    }

    setError("");
    setSuccess("");

    const newImages: ImageItem[] =
      validFiles.map((file) => ({
        id:
          typeof crypto !== "undefined" &&
          crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      }));

    setImages((current) => [
      ...current,
      ...newImages,
    ]);
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (event.target.files) {
      addImages(event.target.files);
    }

    event.target.value = "";
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files) {
      addImages(event.dataTransfer.files);
    }
  }

  function removeImage(id: string) {
    setImages((current) => {
      const image = current.find(
        (item) => item.id === id
      );

      if (image) {
        URL.revokeObjectURL(image.url);
      }

      return current.filter(
        (item) => item.id !== id
      );
    });

    setSuccess("");
  }

  function clearAll() {
    images.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });

    setImages([]);
    setError("");
    setSuccess("");
  }

  function moveImage(
    index: number,
    direction: "left" | "right"
  ) {
    const newIndex =
      direction === "left"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= images.length
    ) {
      return;
    }

    setImages((current) => {
      const updated = [...current];

      [
        updated[index],
        updated[newIndex],
      ] = [
        updated[newIndex],
        updated[index],
      ];

      return updated;
    });
  }

  function loadImage(
    url: string
  ): Promise<HTMLImageElement> {
    return new Promise(
      (resolve, reject) => {
        const image = new Image();

        image.onload = () =>
          resolve(image);

        image.onerror = () =>
          reject(
            new Error(
              "Unable to load image."
            )
          );

        image.src = url;
      }
    );
  }

  async function createPDF() {
    if (images.length === 0) {
      setError(
        "Please add at least one image."
      );
      return;
    }

    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
        compress: true,
      });

      const pageWidth =
        orientation === "portrait"
          ? pageSize === "a4"
            ? 210
            : 215.9
          : pageSize === "a4"
            ? 297
            : 279.4;

      const pageHeight =
        orientation === "portrait"
          ? pageSize === "a4"
            ? 297
            : 279.4
          : pageSize === "a4"
            ? 210
            : 215.9;

      const margin = 10;

      const maxWidth =
        pageWidth - margin * 2;

      const maxHeight =
        pageHeight - margin * 2;

      for (
        let index = 0;
        index < images.length;
        index++
      ) {
        const item = images[index];

        const image = await loadImage(
          item.url
        );

        const imageWidth =
          image.naturalWidth;

        const imageHeight =
          image.naturalHeight;

        const widthRatio =
          maxWidth / imageWidth;

        const heightRatio =
          maxHeight / imageHeight;

        const scale = Math.min(
          widthRatio,
          heightRatio
        );

        const finalWidth =
          imageWidth * scale;

        const finalHeight =
          imageHeight * scale;

        const x =
          (pageWidth - finalWidth) / 2;

        const y =
          (pageHeight - finalHeight) / 2;

        if (index > 0) {
          pdf.addPage(
            pageSize,
            orientation
          );
        }

        pdf.addImage(
          item.url,
          item.file.type ===
            "image/png"
            ? "PNG"
            : "JPEG",
          x,
          y,
          finalWidth,
          finalHeight,
          undefined,
          "FAST"
        );
      }

      pdf.save(
        `exactkb-images-${Date.now()}.pdf`
      );

      setSuccess(
        `PDF created successfully with ${images.length} ${
          images.length === 1
            ? "image"
            : "images"
        }.`
      );
    } catch {
      setError(
        "Could not create PDF. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9fc] text-[#211b2b]">

      {/* ANIMATIONS */}

      <style jsx global>{`
        @keyframes imagePdfFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imagePdfFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes imagePdfSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .image-pdf-fade {
          animation: imagePdfFadeUp
            0.7s ease-out both;
        }

        .image-pdf-float {
          animation: imagePdfFloat
            3s ease-in-out infinite;
        }

        .image-pdf-spin {
          animation: imagePdfSpin
            0.8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .image-pdf-fade,
          .image-pdf-float,
          .image-pdf-spin {
            animation: none !important;
          }
        }
      `}</style>

      {/* HEADER */}

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
              <div className="text-xl font-black tracking-tight">
                Exact
                <span className="text-violet-600">
                  KB
                </span>
              </div>

              <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#a29aaf] sm:block">
                Image to PDF
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-medium text-[#766d80] md:flex">
            <a
              href="/"
              className="transition hover:text-violet-600"
            >
              Home
            </a>

            <a
              href="/passport-photo"
              className="transition hover:text-violet-600"
            >
              Passport Photo
            </a>

            <a
              href="/#features"
              className="transition hover:text-violet-600"
            >
              Tools
            </a>
          </nav>

          <div className="rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            Free Forever
          </div>

        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden px-5 pb-10 pt-16 sm:pt-24">

        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-[110px]" />

        <div className="image-pdf-fade relative mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Fast • Private • Free
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Convert Images to
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              PDF Instantly
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#746b7d] sm:text-lg">
            Combine JPG, PNG and WebP images into
            a professional PDF document.
            Simple, fast and completely browser-based.
          </p>

        </div>
      </section>

      {/* TOOL */}

      <section className="relative z-10 px-5 pb-24">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">

            <div className="rounded-[24px] border border-[#eee9f4] bg-[#fdfcff] p-5 sm:p-8">

              {/* UPLOAD */}

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() =>
                  setIsDragging(false)
                }
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed px-5 py-12 text-center transition duration-300 sm:py-16 ${
                  isDragging
                    ? "scale-[1.01] border-violet-500 bg-violet-50"
                    : "border-[#ddd5e7] bg-[#faf8fd] hover:border-violet-300 hover:bg-violet-50/50"
                }`}
              >

                <div className="image-pdf-float mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-4xl shadow-inner">
                  📄
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Add your images
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#8a8192]">
                  Drag & drop images here
                  <br />
                  or choose files from your device
                </p>

                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-1 hover:shadow-xl active:scale-95"
                >
                  Choose Images
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mt-5 flex justify-center gap-3 text-xs font-semibold text-[#aaa1b2]">
                  <span>JPG</span>
                  <span>•</span>
                  <span>PNG</span>
                  <span>•</span>
                  <span>WebP</span>
                </div>

              </div>

              {/* IMAGE LIST */}

              {images.length > 0 && (
                <div className="mt-8">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <h2 className="text-lg font-black">
                        Your Images
                      </h2>

                      <p className="mt-1 text-sm text-[#8d8492]">
                        {images.length}{" "}
                        {images.length === 1
                          ? "image"
                          : "images"}{" "}
                        selected
                      </p>
                    </div>

                    <button
                      onClick={clearAll}
                      className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50"
                    >
                      Clear All
                    </button>

                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">

                    {images.map(
                      (image, index) => (

                        <div
                          key={image.id}
                          className="group overflow-hidden rounded-2xl border border-[#ebe5f1] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >

                          <div className="relative flex h-48 items-center justify-center bg-[#f6f3f9] p-3">

                            <img
                              src={image.url}
                              alt={`Selected image ${index + 1}`}
                              className="max-h-full max-w-full rounded-xl object-contain"
                            />

                            <div className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-xs font-black text-white shadow">
                              {index + 1}
                            </div>

                            <button
                              onClick={() =>
                                removeImage(image.id)
                              }
                              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:scale-110 hover:bg-red-50"
                              aria-label="Remove image"
                            >
                              ×
                            </button>

                          </div>

                          <div className="p-4">

                            <p className="truncate text-sm font-bold">
                              {image.file.name}
                            </p>

                            <p className="mt-1 text-xs text-[#948a9b]">
                              {formatBytes(
                                image.file.size
                              )}
                            </p>

                            <div className="mt-4 flex gap-2">

                              <button
                                onClick={() =>
                                  moveImage(
                                    index,
                                    "left"
                                  )
                                }
                                disabled={
                                  index === 0
                                }
                                className="flex-1 rounded-lg border border-[#e5dfea] py-2 text-sm font-bold transition hover:border-violet-300 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                ←
                              </button>

                              <button
                                onClick={() =>
                                  moveImage(
                                    index,
                                    "right"
                                  )
                                }
                                disabled={
                                  index ===
                                  images.length - 1
                                }
                                className="flex-1 rounded-lg border border-[#e5dfea] py-2 text-sm font-bold transition hover:border-violet-300 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                →
                              </button>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                  {/* SETTINGS */}

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-black">
                        PDF Page Size
                      </label>

                      <div className="grid grid-cols-2 gap-3">

                        <button
                          onClick={() =>
                            setPageSize("a4")
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            pageSize === "a4"
                              ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200"
                              : "border-[#e5dfea] bg-white text-[#71677b] hover:border-violet-300"
                          }`}
                        >
                          A4
                        </button>

                        <button
                          onClick={() =>
                            setPageSize("letter")
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            pageSize === "letter"
                              ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200"
                              : "border-[#e5dfea] bg-white text-[#71677b] hover:border-violet-300"
                          }`}
                        >
                          Letter
                        </button>

                      </div>

                    </div>

                    <div>

                      <label className="mb-2 block text-sm font-black">
                        Orientation
                      </label>

                      <div className="grid grid-cols-2 gap-3">

                        <button
                          onClick={() =>
                            setOrientation(
                              "portrait"
                            )
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            orientation ===
                            "portrait"
                              ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200"
                              : "border-[#e5dfea] bg-white text-[#71677b] hover:border-violet-300"
                          }`}
                        >
                          Portrait
                        </button>

                        <button
                          onClick={() =>
                            setOrientation(
                              "landscape"
                            )
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            orientation ===
                            "landscape"
                              ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-200"
                              : "border-[#e5dfea] bg-white text-[#71677b] hover:border-violet-300"
                          }`}
                        >
                          Landscape
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* CREATE BUTTON */}

                  <button
                    onClick={createPDF}
                    disabled={isCreating}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {isCreating && (
                      <span className="image-pdf-spin h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
                    )}

                    {isCreating
                      ? "Creating PDF..."
                      : `Create PDF from ${images.length} ${
                          images.length === 1
                            ? "Image"
                            : "Images"
                        }`}

                  </button>

                  {/* ERROR */}

                  {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                      {error}
                    </div>
                  )}

                  {/* SUCCESS */}

                  {success && (
                    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-700">
                      ✓ {success}
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}

      <section className="border-y border-[#ebe5f0] bg-white px-5 py-20">

        <div className="mx-auto max-w-5xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              Why ExactKB
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Simple image to PDF conversion
            </h2>

            <p className="mt-4 text-[#83798b]">
              Convert and combine your images into
              PDF files without installing software.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">

            {[
              {
                icon: "🖼️",
                title: "Multiple Images",
                text: "Add multiple images and combine them into one PDF.",
              },
              {
                icon: "🔒",
                title: "Private",
                text: "Images are processed directly in your browser.",
              },
              {
                icon: "📄",
                title: "A4 & Letter",
                text: "Choose A4 or Letter and select your preferred orientation.",
              },
            ].map((feature) => (

              <div
                key={feature.title}
                className="group rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-100"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl transition group-hover:scale-110">
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

      <section className="px-5 py-20">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Create your PDF in three steps
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">

            {[
              [
                "01",
                "Upload",
                "Select one or more JPG, PNG or WebP images.",
              ],
              [
                "02",
                "Arrange",
                "Change the image order and choose PDF settings.",
              ],
              [
                "03",
                "Download",
                "Create and download your PDF instantly.",
              ],
            ].map(
              ([number, title, text]) => (

                <div
                  key={number}
                  className="transition hover:-translate-y-2"
                >

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 font-black text-white shadow-lg shadow-violet-200">
                    {number}
                  </div>

                  <h3 className="mt-5 font-black">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#83798b]">
                    {text}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>

      {/* FAQ */}

      <section className="border-t border-[#ebe5f0] bg-white px-5 py-20">

        <div className="mx-auto max-w-3xl">

          <div className="text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Image to PDF FAQ
            </h2>

          </div>

          <div className="mt-10 space-y-4">

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5">
              <summary className="cursor-pointer list-none font-black">
                Can I convert multiple images into one PDF?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. You can select multiple JPG,
                PNG or WebP images and combine them
                into a single PDF.
              </p>
            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5">
              <summary className="cursor-pointer list-none font-black">
                Can I change the image order?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                Yes. Use the left and right buttons
                under each image to change its position.
              </p>
            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5">
              <summary className="cursor-pointer list-none font-black">
                Are my images uploaded to a server?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                No. The PDF is generated directly
                in your browser.
              </p>
            </details>

            <details className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-5">
              <summary className="cursor-pointer list-none font-black">
                Which image formats are supported?
              </summary>

              <p className="mt-3 text-sm leading-6 text-[#83798b]">
                JPG, JPEG, PNG and WebP images
                are supported.
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
                Exact
                <span className="text-violet-600">
                  KB
                </span>
              </a>

              <p className="mt-4 max-w-xs text-sm leading-6 text-[#8d8492]">
                Free online image tools for
                everyday tasks. Fast, simple and private.
              </p>

            </div>

            <div>

              <h3 className="text-sm font-black">
                Tools
              </h3>

              <div className="mt-4 space-y-3 text-sm">

                <a
                  href="/"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Image Compressor
                </a>

                <a
                  href="/passport-photo"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Passport Photo
                </a>

                <a
                  href="/image-to-pdf"
                  className="block text-[#817787] hover:text-violet-600"
                >
                  Image to PDF
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

          <div className="mt-10 border-t border-[#e8e2ed] pt-6 text-sm text-[#968c9d]">
            © 2026 ExactKB. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}