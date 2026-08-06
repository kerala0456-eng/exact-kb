"use client";

import { ChangeEvent, useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function BackgroundRemoverPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(selectedFile?: File) {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError("Please select an image smaller than 15 MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult("");
    setError("");
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
  }

  async function removeImageBackground() {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const blob = await removeBackground(file);

      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err) {
      console.error(err);
      setError(
        "Background removal failed. Please try another image."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadResult() {
    if (!result) return;

    const link = document.createElement("a");
    link.href = result;
    link.download = "exactkb-background-removed.png";

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function reset() {
    setFile(null);
    setPreview("");
    setResult("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9fc] text-[#211b2b]">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#ebe6f2] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg font-black text-white shadow-lg">
              K
            </div>

            <div>
              <div className="text-xl font-black tracking-tight">
                Exact<span className="text-violet-600">KB</span>
              </div>

              <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#a29aaf] sm:block">
                Background Remover
              </div>
            </div>
          </a>

          <nav className="hidden gap-7 text-sm font-medium text-[#766d80] md:flex">
            <a href="/" className="transition hover:text-violet-600">
              Image Compressor
            </a>

            <a
              href="/passport-photo"
              className="transition hover:text-violet-600"
            >
              Passport Photo
            </a>
          </nav>

          <div className="rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            Free
          </div>

        </div>
      </header>


      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-10 pt-16 sm:pt-24">

        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
            AI Powered • Fast • Private
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Remove Image Background
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              Automatically
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#746b7d] sm:text-lg">
            Remove backgrounds from your images automatically.
            Create transparent PNG images without complicated software.
          </p>

        </div>
      </section>


      {/* TOOL */}
      <section className="px-5 pb-24">

        <div className="mx-auto max-w-4xl">

          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">

            <div className="rounded-[24px] border border-[#eee9f4] bg-[#fdfcff] p-5 sm:p-8">

              {!file ? (

                <div className="rounded-2xl border-2 border-dashed border-[#ddd5e7] bg-[#faf8fd] px-5 py-16 text-center transition hover:border-violet-400 hover:bg-violet-50/40 sm:py-20">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-4xl">
                    🖼️
                  </div>

                  <h2 className="mt-7 text-2xl font-black">
                    Upload your image
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#8a8192]">
                    JPG, PNG or WebP
                    <br />
                    Maximum file size: 15 MB
                  </p>

                  <button
                    onClick={() => inputRef.current?.click()}
                    className="mt-7 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    Choose Image
                  </button>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleChange}
                    className="hidden"
                  />

                </div>

              ) : (

                <div>

                  {/* PREVIEW */}
                  <div className="grid gap-6 md:grid-cols-2">

                    <div>
                      <p className="mb-3 text-sm font-black">
                        Original Image
                      </p>

                      <div className="overflow-hidden rounded-2xl border border-[#e8e1f0] bg-white p-2">
                        <img
                          src={preview}
                          alt="Original"
                          className="max-h-[420px] w-full rounded-xl object-contain"
                        />
                      </div>
                    </div>


                    <div>
                      <p className="mb-3 text-sm font-black">
                        Result
                      </p>

                      <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-[#e8e1f0] bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]">

                        {loading ? (

                          <div className="text-center">

                            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

                            <p className="mt-4 font-bold text-violet-700">
                              Removing background...
                            </p>

                            <p className="mt-2 text-xs text-[#8a8192]">
                              This may take a little time on the first use.
                            </p>

                          </div>

                        ) : result ? (

                          <img
                            src={result}
                            alt="Background removed"
                            className="max-h-[420px] w-full object-contain"
                          />

                        ) : (

                          <div className="text-center text-sm text-[#aaa1b0]">
                            Your result will appear here
                          </div>

                        )}

                      </div>

                    </div>

                  </div>


                  {/* BUTTONS */}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                    <button
                      onClick={removeImageBackground}
                      disabled={loading}
                      className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? "Removing Background..."
                        : "Remove Background"}
                    </button>

                    {result && (
                      <button
                        onClick={downloadResult}
                        className="flex-1 rounded-xl bg-emerald-600 px-6 py-4 font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-1 hover:bg-emerald-700"
                      >
                        Download PNG
                      </button>
                    )}

                    <button
                      onClick={reset}
                      className="rounded-xl border border-[#e2dce8] bg-white px-6 py-4 font-bold text-[#71677b] transition hover:border-violet-300 hover:text-violet-700"
                    >
                      Change Image
                    </button>

                  </div>

                </div>

              )}


              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>


      {/* FEATURES */}
      <section className="border-y border-[#ebe5f0] bg-white px-5 py-20">

        <div className="mx-auto max-w-5xl">

          <div className="text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              Features
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Simple background removal
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#83798b]">
              Remove unwanted backgrounds and download transparent PNG
              images in just a few clicks.
            </p>

          </div>


          <div className="mt-12 grid gap-5 sm:grid-cols-3">

            <div className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                🤖
              </div>

              <h3 className="mt-5 font-black">
                AI Powered
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Automatically detect the main subject and remove the background.
              </p>
            </div>


            <div className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-100 text-2xl">
                🔒
              </div>

              <h3 className="mt-5 font-black">
                Private
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Processing is performed in your browser after the required model is loaded.
              </p>
            </div>


            <div className="rounded-2xl border border-[#ebe5f0] bg-[#fcfaff] p-7 text-center transition hover:-translate-y-2 hover:shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                ✨
              </div>

              <h3 className="mt-5 font-black">
                Transparent PNG
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Download your finished image with a transparent background.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="px-5 py-20">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
            How It Works
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Remove a background in 3 steps
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">

            {[
              ["01", "Upload", "Select your image."],
              ["02", "Remove", "Let ExactKB process the background."],
              ["03", "Download", "Download your transparent PNG."],
            ].map(([number, title, text]) => (

              <div key={number}>

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 font-black text-white shadow-lg">
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


      {/* FOOTER */}
      <footer className="border-t border-[#ebe5f0] bg-[#faf9fc] px-5 py-12">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

            <div>
              <a href="/" className="text-2xl font-black">
                Exact<span className="text-violet-600">KB</span>
              </a>

              <p className="mt-4 max-w-xs text-sm leading-6 text-[#8d8492]">
                Simple online tools for images and everyday digital tasks.
              </p>
            </div>


            <div>
              <h3 className="text-sm font-black">
                Tools
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <a href="/" className="block text-[#817787] hover:text-violet-600">
                  Image Compressor
                </a>

                <a href="/passport-photo" className="block text-[#817787] hover:text-violet-600">
                  Passport Photo
                </a>

                <a href="/background-remover" className="block text-[#817787] hover:text-violet-600">
                  Background Remover
                </a>
              </div>
            </div>


            <div>
              <h3 className="text-sm font-black">
                Company
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <a href="/about" className="block text-[#817787] hover:text-violet-600">
                  About
                </a>

                <a href="/contact" className="block text-[#817787] hover:text-violet-600">
                  Contact
                </a>
              </div>
            </div>


            <div>
              <h3 className="text-sm font-black">
                Legal
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <a href="/privacy-policy" className="block text-[#817787] hover:text-violet-600">
                  Privacy Policy
                </a>

                <a href="/terms" className="block text-[#817787] hover:text-violet-600">
                  Terms of Service
                </a>
              </div>
            </div>

          </div>


          <div className="mt-10 border-t border-[#e8e2ed] pt-6 text-center text-sm text-[#968c9d]">
            © 2026 ExactKB. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}