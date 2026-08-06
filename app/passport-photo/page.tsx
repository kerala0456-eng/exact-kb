"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";

type PhotoPreset = {
  name: string;
  country: string;
  width: number;
  height: number;
  label: string;
};

const PRESETS: PhotoPreset[] = [
  {
    name: "India Passport Photo",
    country: "India",
    width: 35,
    height: 45,
    label: "35 × 45 mm",
  },
  {
    name: "USA Passport Photo",
    country: "USA",
    width: 51,
    height: 51,
    label: "51 × 51 mm",
  },
  {
    name: "UK Passport Photo",
    country: "UK",
    width: 35,
    height: 45,
    label: "35 × 45 mm",
  },
  {
    name: "Canada Passport Photo",
    country: "Canada",
    width: 50,
    height: 70,
    label: "50 × 70 mm",
  },
  {
    name: "UAE Visa Photo",
    country: "UAE",
    width: 35,
    height: 45,
    label: "35 × 45 mm",
  },
];

const BACKGROUNDS = [
  {
    name: "White",
    value: "#ffffff",
  },
  {
    name: "Light Gray",
    value: "#f2f2f2",
  },
];

export default function PassportPhotoPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");

  const [selectedPreset, setSelectedPreset] =
    useState<PhotoPreset>(PRESETS[0]);

  const [background, setBackground] =
    useState("#ffffff");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [imageUrl, resultUrl]);

  function handleFile(
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

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    const url =
      URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setImageUrl(url);
    setResultUrl("");
    setError("");
    setProgress("");
  }

  function handleInput(
    event: ChangeEvent<HTMLInputElement>
  ) {
    handleFile(event.target.files?.[0]);
  }

  function reset() {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }

    setFile(null);
    setImageUrl("");
    setResultUrl("");
    setError("");
    setProgress("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function loadImage(
    source: string | Blob
  ): Promise<HTMLImageElement> {
    const image = new Image();

    const sourceUrl =
      typeof source === "string"
        ? source
        : URL.createObjectURL(source);

    try {
      await new Promise<void>(
        (resolve, reject) => {
          image.onload = () => resolve();

          image.onerror = () =>
            reject(
              new Error(
                "Unable to load image."
              )
            );

          image.src = sourceUrl;
        }
      );

      return image;
    } finally {
      if (typeof source !== "string") {
        URL.revokeObjectURL(sourceUrl);
      }
    }
  }

  async function createPassportPhoto() {
    if (!file || !imageUrl) {
      setError("Please upload a photo first.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setResultUrl("");

    try {
      setProgress(
        "Preparing your photo..."
      );

      /*
       * Remove the original background.
       * This happens in the browser.
       */
      setProgress(
        "Removing background..."
      );

      const transparentBlob =
        await removeBackground(file);

      setProgress(
        "Creating passport photo..."
      );

      const image =
        await loadImage(transparentBlob);

      /*
       * Output size.
       * 413 px width gives a good digital
       * passport-photo resolution.
       */
      const outputWidth = 413;

      const outputHeight =
        Math.round(
          outputWidth *
            (selectedPreset.height /
              selectedPreset.width)
        );

      const canvas =
        document.createElement("canvas");

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const ctx =
        canvas.getContext("2d");

      if (!ctx) {
        throw new Error(
          "Canvas is not supported."
        );
      }

      /*
       * Background
       */
      ctx.fillStyle = background;

      ctx.fillRect(
        0,
        0,
        outputWidth,
        outputHeight
      );

      /*
       * Crop image to the selected
       * passport aspect ratio.
       */
      const imageRatio =
        image.naturalWidth /
        image.naturalHeight;

      const targetRatio =
        outputWidth /
        outputHeight;

      let sourceWidth =
        image.naturalWidth;

      let sourceHeight =
        image.naturalHeight;

      let sourceX = 0;
      let sourceY = 0;

      if (imageRatio > targetRatio) {
        sourceWidth =
          image.naturalHeight *
          targetRatio;

        sourceX =
          (image.naturalWidth -
            sourceWidth) /
          2;
      } else {
        sourceHeight =
          image.naturalWidth /
          targetRatio;

        sourceY =
          (image.naturalHeight -
            sourceHeight) /
          2;
      }

      /*
       * Draw transparent person
       * over the selected background.
       */
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        outputWidth,
        outputHeight
      );

      setProgress(
        "Finalizing your photo..."
      );

      const blob =
        await new Promise<Blob | null>(
          (resolve) => {
            canvas.toBlob(
              resolve,
              "image/jpeg",
              0.95
            );
          }
        );

      if (!blob) {
        throw new Error(
          "Could not create the image."
        );
      }

      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }

      const finalUrl =
        URL.createObjectURL(blob);

      setResultUrl(finalUrl);
      setProgress(
        "Passport photo is ready!"
      );
    } catch (error) {
      console.error(error);

      setError(
        "Background removal failed. Please try a clear photo with one person."
      );

      setProgress("");
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadPhoto() {
    if (!resultUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = resultUrl;

    link.download =
      `exactkb-${selectedPreset.country.toLowerCase()}-passport-photo.jpg`;

    document.body.appendChild(link);

    link.click();

    link.remove();
  }

  return (
    <main className="min-h-screen bg-[#faf9fc] text-[#211b2b]">

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
                Free Online Tools
              </div>

            </div>

          </a>

          <a
            href="/"
            className="rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
          >
            Image Compressor
          </a>

        </div>

      </header>


      {/* HERO */}

      <section className="relative overflow-hidden px-5 pb-10 pt-16 sm:pt-20">

        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-[110px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">

            <span className="h-2 w-2 rounded-full bg-violet-500" />

            Free • Fast • Private

          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">

            Passport Photo

            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              Maker
            </span>

          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#746b7d] sm:text-lg">
            Create passport, visa and ID photos
            online. Remove the original background,
            choose a new background and download
            your photo instantly.
          </p>

        </div>

      </section>


      {/* TOOL */}

      <section className="px-5 pb-24">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">

            <div className="rounded-[24px] border border-[#eee9f4] bg-[#fdfcff] p-5 sm:p-8">

              {!file ? (

                <div
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-[#ddd5e7] bg-[#faf8fd] px-5 py-20 text-center transition hover:border-violet-400 hover:bg-violet-50/50"
                >

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-4xl shadow-inner">
                    📸
                  </div>

                  <h2 className="mt-7 text-2xl font-black">
                    Upload your photo
                  </h2>

                  <p className="mt-2 text-sm text-[#8a8192]">
                    Choose a clear front-facing photo
                  </p>

                  <button
                    type="button"
                    className="mt-7 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Choose Photo
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleInput}
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                    className="hidden"
                  />

                  <p className="mt-5 text-xs text-[#aaa1b2]">
                    JPG • PNG • WebP
                  </p>

                </div>

              ) : (

                <div>

                  {/* PREVIEW + SETTINGS */}

                  <div className="grid gap-8 md:grid-cols-2">

                    {/* ORIGINAL PHOTO */}

                    <div>

                      <div className="flex items-center justify-between">

                        <h2 className="font-black">
                          Your Photo
                        </h2>

                        <button
                          onClick={reset}
                          className="text-sm font-bold text-violet-600 hover:text-violet-800"
                        >
                          Change
                        </button>

                      </div>

                      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6dfeb] bg-white p-3">

                        <img
                          src={imageUrl}
                          alt="Uploaded photo"
                          className="max-h-[420px] w-full rounded-xl object-contain"
                        />

                      </div>

                      <p className="mt-3 truncate text-sm text-[#8a8192]">
                        {file.name}
                      </p>

                    </div>


                    {/* SETTINGS */}

                    <div>

                      <h2 className="font-black">
                        Photo Settings
                      </h2>


                      {/* SIZE */}

                      <label className="mt-5 block text-sm font-bold">
                        Select photo size
                      </label>

                      <div className="mt-3 space-y-2">

                        {PRESETS.map(
                          (preset) => (

                            <button
                              key={
                                preset.name
                              }
                              onClick={() =>
                                setSelectedPreset(
                                  preset
                                )
                              }
                              className={`w-full rounded-xl border p-4 text-left transition ${
                                selectedPreset.name ===
                                preset.name
                                  ? "border-violet-500 bg-violet-50"
                                  : "border-[#e5dfea] bg-white hover:border-violet-300"
                              }`}
                            >

                              <div className="flex items-center justify-between">

                                <div>

                                  <p className="font-bold">
                                    {
                                      preset.name
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-[#8a8192]">
                                    {
                                      preset.label
                                    }
                                  </p>

                                </div>

                                {selectedPreset.name ===
                                  preset.name && (
                                  <span className="text-lg text-violet-600">
                                    ✓
                                  </span>
                                )}

                              </div>

                            </button>

                          )
                        )}

                      </div>


                      {/* BACKGROUND */}

                      <label className="mt-6 block text-sm font-bold">
                        Background
                      </label>

                      <div className="mt-3 grid grid-cols-2 gap-3">

                        {BACKGROUNDS.map(
                          (item) => (

                            <button
                              key={
                                item.value
                              }
                              onClick={() =>
                                setBackground(
                                  item.value
                                )
                              }
                              className={`rounded-xl border p-3 transition ${
                                background ===
                                item.value
                                  ? "border-violet-500 bg-violet-50"
                                  : "border-[#e5dfea] bg-white hover:border-violet-300"
                              }`}
                            >

                              <div
                                className="mx-auto h-8 w-8 rounded-full border border-[#d9d3df]"
                                style={{
                                  backgroundColor:
                                    item.value,
                                }}
                              />

                              <p className="mt-2 text-sm font-bold">
                                {item.name}
                              </p>

                            </button>

                          )
                        )}

                      </div>


                      {/* GENERATE */}

                      <button
                        onClick={
                          createPassportPhoto
                        }
                        disabled={
                          isGenerating
                        }
                        className="mt-7 w-full rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        {isGenerating
                          ? "Creating Photo..."
                          : "Create Passport Photo"}

                      </button>

                    </div>

                  </div>


                  {/* PROGRESS */}

                  {isGenerating && (
                    <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-5">

                      <div className="flex items-center gap-4">

                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

                        <div>

                          <p className="font-black text-violet-900">
                            Processing your photo
                          </p>

                          <p className="mt-1 text-sm text-violet-700">
                            {progress ||
                              "Please wait..."}
                          </p>

                        </div>

                      </div>

                    </div>
                  )}


                  {/* ERROR */}

                  {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                      {error}
                    </div>
                  )}


                  {/* RESULT */}

                  {resultUrl && !isGenerating && (

                    <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

                      <div className="text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                          ✓
                        </div>

                        <h3 className="mt-4 text-xl font-black text-emerald-950">
                          Passport Photo Ready
                        </h3>

                        <div className="mx-auto mt-6 max-w-[260px] overflow-hidden rounded-xl border border-emerald-200 bg-white p-2">

                          <img
                            src={resultUrl}
                            alt="Generated passport photo"
                            className="w-full"
                          />

                        </div>

                        <p className="mt-4 text-sm font-semibold text-[#6f6578]">
                          {
                            selectedPreset.label
                          }
                        </p>

                        <p className="mt-1 text-xs text-[#8d8492]">
                          Background:{" "}
                          {background ===
                          "#ffffff"
                            ? "White"
                            : "Light Gray"}
                        </p>

                        <button
                          onClick={
                            downloadPhoto
                          }
                          className="mt-6 rounded-xl bg-emerald-600 px-8 py-3.5 font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                          Download Photo
                        </button>

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

      <section className="border-y border-[#ebe5f0] bg-white px-5 py-20">

        <div className="mx-auto max-w-5xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              ExactKB Passport Photo
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Create your photo in seconds
            </h2>

            <p className="mt-4 text-[#83798b]">
              Simple tools for passport, visa and
              ID photo preparation.
            </p>

          </div>


          <div className="mt-12 grid gap-5 sm:grid-cols-3">

            <div className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                📐
              </div>

              <h3 className="mt-5 font-black">
                Standard Sizes
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Choose common passport and visa
                photo dimensions.
              </p>

            </div>


            <div className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-100 text-2xl">
                ✂️
              </div>

              <h3 className="mt-5 font-black">
                Background Removal
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Remove the original background
                before creating your photo.
              </p>

            </div>


            <div className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                🔒
              </div>

              <h3 className="mt-5 font-black">
                Browser Processing
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Your selected photo is processed
                directly in your browser.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="border-t border-[#ebe5f0] bg-[#faf9fc] px-5 py-10">

        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[#8d8492] sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 ExactKB. All rights reserved.
          </p>

          <div className="flex gap-5">

            <a
              href="/privacy-policy"
              className="hover:text-violet-600"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="hover:text-violet-600"
            >
              Terms
            </a>

            <a
              href="/contact"
              className="hover:text-violet-600"
            >
              Contact
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}