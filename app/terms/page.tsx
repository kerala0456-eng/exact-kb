import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the ExactKB Terms of Service for using the online image compression tool.",
};

export default function TermsPage() {
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
            Home
          </a>

        </div>
      </header>

      <article className="px-5 py-16">

        <div className="mx-auto max-w-4xl rounded-3xl border border-[#ebe5f0] bg-white p-7 shadow-sm sm:p-10">

          <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Terms of Service
          </h1>

          <p className="mt-4 text-sm text-[#8b8190]">
            Last updated: August 6, 2026
          </p>

          <div className="mt-10 space-y-9 leading-7 text-[#6f6578]">

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                1. Acceptance of Terms
              </h2>

              <p className="mt-3">
                By accessing or using ExactKB, you agree to these
                Terms of Service. If you do not agree with these terms,
                please do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                2. Description of the Service
              </h2>

              <p className="mt-3">
                ExactKB provides an online image compression tool that
                allows users to process supported image files and
                create smaller image files based on selected settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                3. Acceptable Use
              </h2>

              <p className="mt-3">
                You agree to use ExactKB only for lawful purposes and
                in a way that does not interfere with the operation or
                security of the website.
              </p>

              <p className="mt-3">
                You must not attempt to abuse, disrupt, reverse
                engineer, overload or gain unauthorized access to the
                website or its infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                4. Your Files
              </h2>

              <p className="mt-3">
                You are responsible for the images and other content
                you choose to process using ExactKB. You should have
                the necessary rights or permission to use the files
                you process.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                5. Compression Results
              </h2>

              <p className="mt-3">
                Compression results can vary depending on the original
                image, dimensions, format and other characteristics.
                ExactKB does not guarantee a particular visual quality
                or exact final file size for every image.
              </p>

              <p className="mt-3">
                Users should review compressed files before relying on
                them for important purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                6. Availability
              </h2>

              <p className="mt-3">
                We aim to keep ExactKB available and useful, but we do
                not guarantee uninterrupted access. Features may be
                changed, improved, suspended or discontinued when
                necessary.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                7. Disclaimer
              </h2>

              <p className="mt-3">
                ExactKB is provided on an as-is and as-available basis.
                To the extent permitted by applicable law, we make no
                warranties regarding availability, accuracy, suitability
                or fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                8. Changes to These Terms
              </h2>

              <p className="mt-3">
                These Terms of Service may be updated from time to time.
                Updated terms will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                9. Contact
              </h2>

              <p className="mt-3">
                If you have questions about these Terms of Service,
                please contact us through the Contact page.
              </p>

              <a
                href="/contact"
                className="mt-4 inline-block font-bold text-violet-600"
              >
                Contact ExactKB →
              </a>
            </section>

          </div>

        </div>

      </article>

      <footer className="border-t border-[#ebe5f0] bg-white px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[#8d8492] sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 ExactKB. All rights reserved.
          </p>

          <div className="flex gap-5">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/privacy-policy">Privacy</a>
          </div>

        </div>
      </footer>

    </main>
  );
}