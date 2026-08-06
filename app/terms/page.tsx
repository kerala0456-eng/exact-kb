export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#faf9fc] text-[#211b2b]">

      <header className="border-b border-[#ebe6f2] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">

          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            Exact<span className="text-violet-600">KB</span>
          </a>

          <a
            href="/"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            Back to Tool
          </a>

        </div>
      </header>

      <section className="px-5 py-14 sm:py-20">

        <div className="mx-auto max-w-3xl">

          <div className="text-center">

            <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-600">
              Legal
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Terms of Service
            </h1>

            <p className="mt-4 text-sm text-[#8b8292]">
              Last updated: August 2026
            </p>

          </div>

          <div className="mt-12 space-y-6">

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                1. Acceptance of Terms
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                By accessing or using ExactKB, you agree to
                these Terms of Service. If you do not agree
                with these terms, please do not use the website.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                2. Use of the Service
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                ExactKB provides online image compression
                functionality. You agree to use the service
                only for lawful purposes and in accordance
                with applicable laws.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                3. User Responsibility
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                You are responsible for the files you choose
                to process and for ensuring that you have the
                necessary rights or permission to use those
                files.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                4. Prohibited Use
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                You must not use ExactKB for unlawful activities,
                attempts to damage or disrupt the service, or
                activities that violate the rights of others.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                5. Service Availability
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                We aim to keep ExactKB available and functional,
                but we do not guarantee that the website will
                always be available, uninterrupted, or free
                from errors.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                6. Results and Accuracy
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                Image compression results can vary depending
                on the original image, format, dimensions,
                compression settings, and other technical
                factors. ExactKB does not guarantee a specific
                visual quality or exact final file size in
                every situation.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                7. Intellectual Property
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                The ExactKB website, branding, design, text,
                and original software are protected by
                applicable intellectual property laws.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                8. Disclaimer
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                ExactKB is provided on an "as available" basis.
                To the extent permitted by law, we make no
                guarantees regarding uninterrupted service
                or suitability for a particular purpose.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                9. Changes to These Terms
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                We may update these Terms of Service when
                necessary. Updated terms will be published
                on this page.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                10. Contact
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                If you have questions about these Terms of
                Service, please contact us through the
                Contact page.
              </p>

            </section>

          </div>

          <div className="mt-10 text-center">

            <a
              href="/"
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5"
            >
              Back to ExactKB
            </a>

          </div>

        </div>

      </section>

      <footer className="border-t border-[#ebe5f0] bg-white px-5 py-8 text-center text-sm text-[#968c9d]">
        © 2026 ExactKB. All rights reserved.
      </footer>

    </main>
  );
}