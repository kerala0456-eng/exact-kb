export default function PrivacyPage() {
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
              Privacy Policy
            </h1>

            <p className="mt-4 text-sm text-[#8b8292]">
              Last updated: August 2026
            </p>

          </div>

          <div className="mt-12 space-y-6">

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                1. Introduction
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                Welcome to ExactKB. We respect your privacy
                and are committed to providing a simple and
                transparent experience when you use our website.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                2. Images and Files
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                The current image compression feature processes
                images directly in your web browser. Images
                selected for compression are not intentionally
                uploaded to an ExactKB server as part of the
                normal compression process.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                3. Information We Collect
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                ExactKB does not require an account to use the
                image compression tool. We may use standard
                website technologies such as analytics,
                cookies, or similar technologies in the future
                to understand website usage and improve our
                services.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                4. Cookies
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                Cookies may be used to remember preferences,
                measure website performance, provide relevant
                functionality, or support advertising services.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                5. Third-Party Services
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                We may use third-party services such as
                analytics and advertising providers. These
                services may collect information according to
                their own privacy policies.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                6. Advertising
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                If advertising is enabled on ExactKB, third-party
                advertising providers may use cookies or similar
                technologies to provide and measure advertisements.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                7. Children's Privacy
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                ExactKB is not designed to knowingly collect
                personal information from children.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                8. Changes to This Policy
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                We may update this Privacy Policy when our
                website, features, or services change. Any
                updates will be reflected on this page.
              </p>

            </section>

            <section className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                9. Contact
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                If you have questions about this Privacy Policy,
                please contact us through the Contact page.
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