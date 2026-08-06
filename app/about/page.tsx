import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ExactKB, a simple online image compression tool for reducing JPG, PNG and WebP image sizes.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf9fc] text-[#211b2b]">

      <header className="border-b border-[#ebe5f0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a
            href="/"
            className="text-2xl font-black"
          >
            Exact<span className="text-violet-600">KB</span>
          </a>

          <a
            href="/"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white"
          >
            Image Compressor
          </a>
        </div>
      </header>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-4xl">

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              About ExactKB
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              A simple way to reduce image file size
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#766d80]">
              ExactKB is an online image compression tool created to
              make reducing image file sizes simple and accessible.
            </p>
          </div>

          <div className="mt-14 space-y-8">

            <section className="rounded-3xl border border-[#ebe5f0] bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-2xl font-black">
                What is ExactKB?
              </h2>

              <p className="mt-4 leading-7 text-[#766d80]">
                ExactKB helps users reduce the size of supported image
                files when they need a smaller file for uploading,
                sharing or storing.
              </p>

              <p className="mt-4 leading-7 text-[#766d80]">
                The tool provides preset target sizes and a custom
                target option so users can choose the approximate file
                size they need.
              </p>
            </section>

            <section className="rounded-3xl border border-[#ebe5f0] bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-2xl font-black">
                Our approach
              </h2>

              <p className="mt-4 leading-7 text-[#766d80]">
                We believe everyday online tools should be easy to
                understand. ExactKB therefore focuses on a straightforward
                workflow: choose an image, select a target size, compress
                it and download the result.
              </p>
            </section>

            <section className="rounded-3xl border border-[#ebe5f0] bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-2xl font-black">
                Privacy-focused processing
              </h2>

              <p className="mt-4 leading-7 text-[#766d80]">
                The current image compression process runs directly in
                the user's browser. This means the compression operation
                does not require sending the image to a separate
                compression server.
              </p>

              <p className="mt-4 leading-7 text-[#766d80]">
                For more information about how the website handles
                information, please read our Privacy Policy.
              </p>

              <a
                href="/privacy-policy"
                className="mt-5 inline-block font-bold text-violet-600"
              >
                Read Privacy Policy →
              </a>
            </section>

            <section className="rounded-3xl border border-[#ebe5f0] bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-2xl font-black">
                Contact ExactKB
              </h2>

              <p className="mt-4 leading-7 text-[#766d80]">
                If you have a question, notice a problem or want to
                share feedback about the service, you can contact us
                through our Contact page.
              </p>

              <a
                href="/contact"
                className="mt-5 inline-block rounded-xl bg-violet-600 px-5 py-3 font-bold text-white"
              >
                Contact Us
              </a>
            </section>

          </div>

        </div>
      </section>

      <footer className="border-t border-[#ebe5f0] bg-white px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[#8d8492] sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 ExactKB. All rights reserved.
          </p>

          <div className="flex gap-5">
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>

        </div>
      </footer>

    </main>
  );
}