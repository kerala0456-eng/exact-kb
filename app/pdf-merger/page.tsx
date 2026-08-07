
"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    const pdfFiles = selectedFiles.filter(function (file) {
      return file.name.toLowerCase().endsWith(".pdf");
    });

    if (pdfFiles.length === 0) {
      setError("Please select PDF files only.");
      return;
    }

    setFiles(function (oldFiles) {
      return oldFiles.concat(pdfFiles);
    });

    setError("");
  }

  function removeFile(index: number) {
    setFiles(function (oldFiles) {
      return oldFiles.filter(function (_, i) {
        return i !== index;
      });
    });
  }

  function clearFiles() {
    setFiles([]);
    setError("");
  }

  async function mergePDFs() {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const buffer = await file.arrayBuffer();

        const pdf = await PDFDocument.load(buffer);

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        for (let j = 0; j < pages.length; j++) {
          mergedPdf.addPage(pages[j]);
        }
      }

      const pdfBytes = await mergedPdf.save();

const output = new ArrayBuffer(pdfBytes.byteLength);
const outputView = new Uint8Array(output);

outputView.set(pdfBytes);

const blob = new Blob([output], {
  type: "application/pdf",
});

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "ExactKB-Merged.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);

      setFiles([]);
    } catch (err) {
      console.error(err);

      setError(
        "PDF merge failed. Please make sure all selected files are valid PDF files."
      );
    } finally {
      setLoading(false);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 font-black text-white">
              K
            </div>

            <div className="text-xl font-black">
              Exact
              <span className="text-violet-600">
                KB
              </span>
            </div>
          </a>

          <span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">
            Free Tool
          </span>

        </div>
      </header>

      <section className="px-5 pb-24 pt-16">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-4xl">
            📄
          </div>

          <h1 className="mt-7 text-4xl font-black sm:text-5xl">
            Merge PDF Files
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#766d80]">
            Combine multiple PDF files into one PDF
            document quickly and easily.
          </p>

        </div>

        <div className="mx-auto mt-12 max-w-2xl">

          <div className="rounded-[30px] border border-[#e8e1f0] bg-white p-2 shadow-xl">

            <div className="rounded-[24px] bg-[#fdfcff] p-6 sm:p-8">

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ddd5e7] bg-[#faf8fd] px-5 py-16 text-center transition hover:border-violet-400 hover:bg-violet-50">

                <div className="text-5xl">
                  📑
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Upload PDF files
                </h2>

                <p className="mt-2 text-sm text-[#8a8192]">
                  Select two or more PDF files
                </p>

                <span className="mt-7 rounded-xl bg-violet-600 px-8 py-4 font-black text-white shadow-lg">
                  Choose PDF Files
                </span>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFiles}
                  className="hidden"
                />

                <p className="mt-5 text-xs text-[#aaa1b2]">
                  PDF files only
                </p>

              </label>

              {files.length > 0 && (
                <div className="mt-8">

                  <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-black">
                      Selected Files
                    </h2>

                    <button
                      type="button"
                      onClick={clearFiles}
                      className="rounded-lg px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
                    >
                      Clear All
                    </button>

                  </div>

                  <div className="space-y-3">

                    {files.map(function (file, index) {
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-4 rounded-xl border border-[#ebe5f1] bg-white p-4"
                        >

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 font-black text-violet-700">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate font-bold">
                              {file.name}
                            </p>

                            <p className="mt-1 text-xs text-[#918797]">
                              {(
                                file.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={function () {
                              removeFile(index);
                            }}
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-100"
                          >
                            Remove
                          </button>

                        </div>
                      );
                    })}

                  </div>

                  <button
                    type="button"
                    onClick={mergePDFs}
                    disabled={
                      loading || files.length < 2
                    }
                    className="mt-7 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Merging PDFs..."
                      : "Merge PDFs & Download"}
                  </button>

                  {files.length < 2 && (
                    <p className="mt-3 text-center text-xs text-[#918797]">
                      Select at least 2 PDF files.
                    </p>
                  )}

                </div>
              )}

              {error !== "" && (
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
                Fast
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Merge your PDF files quickly.
              </p>

            </div>

            <div className="rounded-2xl border border-[#ebe5f0] p-7 text-center">

              <div className="text-3xl">
                🔒
              </div>

              <h3 className="mt-4 font-black">
                Private
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Files are processed directly in your browser.
              </p>

            </div>

            <div className="rounded-2xl border border-[#ebe5f0] p-7 text-center">

              <div className="text-3xl">
                📄
              </div>

              <h3 className="mt-4 font-black">
                Simple
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Upload, merge and download.
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

