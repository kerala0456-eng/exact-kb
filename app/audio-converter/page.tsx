"use client";

import { ChangeEvent, useRef, useState } from "react";

export default function AudioConverter() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState("192");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function selectFile(selected: File | undefined) {
    if (!selected) return;

    const allowed = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
    ];

    if (!allowed.includes(selected.type)) {
      setError("Please select a supported audio or video file.");
      return;
    }

    setFile(selected);
    setError("");
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
  }

  async function convertToMp3() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bitrate", bitrate);

      const response = await fetch("/api/audio-converter", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed.");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download =
        `${file.name.replace(/\.[^/.]+$/, "")}.mp3`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      setError(
        "Conversion failed. Please try another file."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9fc] text-[#211b2b]">

      <header className="border-b border-[#ebe6f2] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 font-black text-white">
              K
            </div>

            <div className="text-xl font-black">
              Exact<span className="text-violet-600">KB</span>
            </div>
          </a>

          <span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            Free Tool
          </span>

        </div>
      </header>

      <section className="px-5 pb-24 pt-16">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-4xl">
            🎵
          </div>

          <h1 className="mt-7 text-4xl font-black sm:text-5xl">
            Video to MP3 Converter
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#766d80]">
            Convert your own video or audio files into
            high-quality MP3 audio directly with ExactKB.
          </p>

        </div>

        <div className="mx-auto mt-12 max-w-2xl">

          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">

            <div className="rounded-[24px] bg-[#fdfcff] p-6 sm:p-8">

              {!file ? (

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    selectFile(e.dataTransfer.files?.[0]);
                  }}
                  className="rounded-2xl border-2 border-dashed border-[#ddd5e7] bg-[#faf8fd] px-5 py-16 text-center transition hover:border-violet-400 hover:bg-violet-50/40"
                >

                  <div className="text-5xl">
                    🎬
                  </div>

                  <h2 className="mt-6 text-2xl font-black">
                    Upload your media
                  </h2>

                  <p className="mt-2 text-sm text-[#8a8192]">
                    Drag & drop your video or audio file here
                  </p>

                  <button
                    onClick={() => inputRef.current?.click()}
                    className="mt-7 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-black text-white shadow-lg transition hover:-translate-y-1"
                  >
                    Choose File
                  </button>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="video/*,audio/*"
                    onChange={handleFile}
                    className="hidden"
                  />

                  <p className="mt-5 text-xs text-[#aaa1b2]">
                    MP4 • WebM • MOV • MP3 • WAV • OGG
                  </p>

                </div>

              ) : (

                <div>

                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#ebe5f1] bg-white p-4">

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl">
                        🎬
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold">
                          {file.name}
                        </p>

                        <p className="mt-1 text-sm text-[#918797]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={reset}
                      className="rounded-lg border px-4 py-2 text-sm font-bold hover:bg-violet-50"
                    >
                      Change
                    </button>

                  </div>

                  <div className="mt-8">

                    <label className="text-sm font-black">
                      MP3 Quality
                    </label>

                    <div className="mt-4 grid grid-cols-3 gap-3">

                      {["128", "192", "320"].map((value) => (

                        <button
                          key={value}
                          onClick={() => setBitrate(value)}
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            bitrate === value
                              ? "border-violet-500 bg-violet-600 text-white"
                              : "border-[#e5dfea] bg-white text-[#71677b] hover:border-violet-300"
                          }`}
                        >
                          {value} kbps
                        </button>

                      ))}

                    </div>

                  </div>

                  <button
                    onClick={convertToMp3}
                    disabled={loading}
                    className="mt-8 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Converting..."
                      : `Convert to MP3 • ${bitrate} kbps`}
                  </button>

                </div>

              )}

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-600">
                  {error}
                </div>
              )}

            </div>

          </div>

        </div>

      </section>

      <section className="border-y border-[#ebe5f0] bg-white px-5 py-20">

        <div className="mx-auto max-w-5xl">

          <div className="grid gap-5 sm:grid-cols-3">

            <div className="rounded-2xl border p-7 text-center">
              <div className="text-3xl">⚡</div>
              <h3 className="mt-4 font-black">
                Fast Conversion
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Convert compatible media files into MP3 quickly.
              </p>
            </div>

            <div className="rounded-2xl border p-7 text-center">
              <div className="text-3xl">🎧</div>
              <h3 className="mt-4 font-black">
                Multiple Bitrates
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Choose 128, 192 or 320 kbps.
              </p>
            </div>

            <div className="rounded-2xl border p-7 text-center">
              <div className="text-3xl">🔒</div>
              <h3 className="mt-4 font-black">
                Simple & Secure
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Designed for converting media files you have
                the right to use.
              </p>
            </div>

          </div>

        </div>

      </section>

      <footer className="border-t border-[#ebe5f0] px-5 py-10 text-center text-sm text-[#968c9d]">
        © 2026 ExactKB. All rights reserved.
      </footer>

    </main>
  );
}