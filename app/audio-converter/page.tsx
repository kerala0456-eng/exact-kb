"use client";

import { ChangeEvent, useRef, useState } from "react";

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return String(bytes) + " B";
  }

  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }

  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function AudioConverter() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState("192");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function selectFile(selectedFile: File | undefined) {
    if (!selectedFile) {
      return;
    }

    const isAudio = selectedFile.type.startsWith("audio/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isAudio && !isVideo) {
      setError("Please select a supported audio or video file.");
      return;
    }

    setFile(selectedFile);
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
        const message = await response.text();
        throw new Error(message || "Conversion failed.");
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("Empty audio file received.");
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = file.name.replace(/\.[^/.]+$/, "") + ".mp3";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (conversionError) {
      console.error(conversionError);

      setError(
        "Conversion failed. Please check that FFmpeg is configured correctly."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setError("");
    setBitrate("192");

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
              Exact
              <span className="text-violet-600">KB</span>
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
            Convert your video or audio files into
            high-quality MP3 audio with ExactKB.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">
            <div className="rounded-[24px] bg-[#fdfcff] p-6 sm:p-8">
              {!file ? (
                <div
                  onDragOver={function (event) {
                    event.preventDefault();
                  }}
                  onDrop={function (event) {
                    event.preventDefault();
                    selectFile(event.dataTransfer.files?.[0]);
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
                    Drag and drop your video or audio file here
                  </p>

                  <button
                    type="button"
                    onClick={function () {
                      inputRef.current?.click();
                    }}
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
                  <div className="flex flex-col gap-4 rounded-2xl border border-[#ebe5f1] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl">
                        🎬
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold">
                          {file.name}
                        </p>

                        <p className="mt-1 text-sm text-[#918797]">
                          {formatBytes(file.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-lg border border-[#e5dfea] px-4 py-2 text-sm font-bold transition hover:bg-violet-50"
                    >
                      Change
                    </button>
                  </div>

                  <div className="mt-8">
                    <label className="text-sm font-black">
                      MP3 Quality
                    </label>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {["128", "192", "320"].map(function (value) {
                        const active = bitrate === value;

                        return (
                          <button
                            type="button"
                            key={value}
                            onClick={function () {
                              setBitrate(value);
                            }}
                            className={
                              active
                                ? "rounded-xl border border-violet-500 bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200"
                                : "rounded-xl border border-[#e5dfea] bg-white px-4 py-3 text-sm font-bold text-[#71677b] transition hover:border-violet-300"
                            }
                          >
                            {value} kbps
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={convertToMp3}
                    disabled={loading}
                    className="mt-8 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Converting..."
                      : "Convert to MP3 - " + bitrate + " kbps"}
                  </button>

                  <button
                    type="button"
                    onClick={reset}
                    disabled={loading}
                    className="mt-3 w-full rounded-xl border border-[#e5dfea] bg-white px-6 py-3 font-bold text-[#71677b] transition hover:border-violet-300 hover:bg-violet-50"
                  >
                    Choose Another File
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
            <div className="rounded-2xl border border-[#ebe5f0] p-7 text-center">
              <div className="text-3xl">
                ⚡
              </div>

              <h3 className="mt-4 font-black">
                Fast Conversion
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Convert compatible media files into MP3 quickly.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ebe5f0] p-7 text-center">
              <div className="text-3xl">
                🎧
              </div>

              <h3 className="mt-4 font-black">
                Multiple Bitrates
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Choose 128, 192 or 320 kbps audio quality.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ebe5f0] p-7 text-center">
              <div className="text-3xl">
                🔒
              </div>

              <h3 className="mt-4 font-black">
                Simple & Secure
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Convert media files that you have permission to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Convert in three simple steps
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 font-black text-white">
                1
              </div>

              <h3 className="mt-4 font-black">
                Upload
              </h3>

              <p className="mt-2 text-sm text-[#83798b]">
                Select your video or audio file.
              </p>
            </div>

            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 font-black text-white">
                2
              </div>

              <h3 className="mt-4 font-black">
                Select Quality
              </h3>

              <p className="mt-2 text-sm text-[#83798b]">
                Choose 128, 192 or 320 kbps.
              </p>
            </div>

            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 font-black text-white">
                3
              </div>

              <h3 className="mt-4 font-black">
                Download
              </h3>

              <p className="mt-2 text-sm text-[#83798b]">
                Your MP3 file will download automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ebe5f0] bg-[#faf9fc] px-5 py-10 text-center text-sm text-[#968c9d]">
        © 2026 ExactKB. All rights reserved.
      </footer>
    </main>
  );
}