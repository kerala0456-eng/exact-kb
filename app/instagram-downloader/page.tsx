"use client";

import { FormEvent, useState } from "react";

export default function InstagramDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleDownload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setError("Please enter an Instagram Reel or video URL.");
      return;
    }

    if (
      !/^https?:\/\/(www\.)?instagram\.com\/(reel|p|tv)\//i.test(
        cleanUrl
      )
    ) {
      setError("Please enter a valid Instagram Reel or video URL.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/instagram-downloader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: cleanUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to process this Instagram video."
        );
      }

      if (!data.downloadUrl) {
        throw new Error("No downloadable video was found.");
      }

      /*
       * Open the returned media URL.
       * The API returns the actual media URL.
       */
      const downloadWindow = window.open(
        data.downloadUrl,
        "_blank",
        "noopener,noreferrer"
      );

      if (!downloadWindow) {
        throw new Error(
          "Your browser blocked the download window. Please allow pop-ups for this site."
        );
      }

      setSuccess(
        "Video is ready. Your video has been opened in a new tab."
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function clearUrl() {
    setUrl("");
    setError("");
    setSuccess("");
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
            📸
          </div>

          <h1 className="mt-7 text-4xl font-black sm:text-5xl">
            Instagram Video Downloader
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#766d80]">
            Download publicly available Instagram videos and
            Reels by entering the video URL.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-[0_25px_80px_rgba(83,53,112,0.12)]">
            <div className="rounded-[24px] bg-[#fdfcff] p-6 sm:p-8">
              <form onSubmit={handleDownload}>
                <label
                  htmlFor="instagram-url"
                  className="block text-left text-sm font-black"
                >
                  Instagram Video URL
                </label>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="instagram-url"
                    type="url"
                    value={url}
                    onChange={(event) => {
                      setUrl(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    placeholder="https://www.instagram.com/reel/..."
                    className="min-w-0 flex-1 rounded-xl border border-[#ddd5e7] bg-white px-4 py-4 text-sm outline-none transition placeholder:text-[#aaa1b2] focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    disabled={loading}
                  />

                  {url && (
                    <button
                      type="button"
                      onClick={clearUrl}
                      disabled={loading}
                      className="rounded-xl border border-[#e5dfea] px-5 py-3 text-sm font-bold text-[#71677b] transition hover:bg-violet-50 disabled:opacity-50"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </span>
                  ) : (
                    "Download Video"
                  )}
                </button>
              </form>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-bold text-green-700">
                  {success}
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
                <div className="flex gap-3">
                  <div className="text-xl">💡</div>

                  <div className="text-left">
                    <h2 className="font-black text-violet-900">
                      How to use
                    </h2>

                    <ol className="mt-2 space-y-1 text-sm leading-6 text-violet-800">
                      <li>
                        1. Copy a public Instagram Reel or video URL.
                      </li>
                      <li>
                        2. Paste the URL above.
                      </li>
                      <li>
                        3. Click Download Video.
                      </li>
                      <li>
                        4. Your available video will open in a new tab.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ebe5f0] bg-white px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#ebe5f0] p-7 text-center">
              <div className="text-3xl">⚡</div>

              <h3 className="mt-4 font-black">
                Fast
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Simple URL-based Instagram video processing.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ebe5f0] p-7 text-center">
              <div className="text-3xl">📱</div>

              <h3 className="mt-4 font-black">
                Mobile Friendly
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Responsive interface for phones, tablets and desktops.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ebe5f0] p-7 text-center">
              <div className="text-3xl">🔒</div>

              <h3 className="mt-4 font-black">
                Simple & Secure
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Use this tool only for content you have permission
                to download.
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