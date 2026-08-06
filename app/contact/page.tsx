import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ExactKB for questions, feedback, technical issues or suggestions.",
};

export default function ContactPage() {
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

      <section className="px-5 py-20">
        <div className="mx-auto max-w-3xl">

          <div className="text-center">

            <p className="text-xs font-black uppercase tracking-[0.25em] text-violet-600">
              Contact
            </p>

            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              We'd love to hear from you
            </h1>

            <p className="mx-auto mt-6 max-w-2xl leading-7 text-[#766d80]">
              Have a question about ExactKB, found a problem or have
              a suggestion? Contact us and provide as much useful
              information as possible.
            </p>

          </div>

          <div className="mt-12 rounded-3xl border border-[#ebe5f0] bg-white p-7 shadow-sm sm:p-9">

            <h2 className="text-2xl font-black">
              Email us
            </h2>

            <p className="mt-4 leading-7 text-[#766d80]">
              For questions, feedback, technical issues and other
              enquiries, please email:
            </p>

            <a
              href="mailto:support@exactkb.com"
              className="mt-5 inline-block break-all text-lg font-black text-violet-600"
            >
              supportexactkb@gmail.com
            </a>

            <div className="mt-8 rounded-2xl bg-violet-50 p-5 text-sm leading-6 text-[#6f6578]">
              When reporting a technical problem, please include the
              type of device, browser and a short description of what
              happened. Do not send passwords, payment information or
              other sensitive personal information.
            </div>

          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div className="rounded-2xl border border-[#ebe5f0] bg-white p-6">
              <h3 className="font-black">
                Technical issue
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Tell us what you were trying to do and what happened.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ebe5f0] bg-white p-6">
              <h3 className="font-black">
                Feedback
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#83798b]">
                Suggestions that can make ExactKB more useful are
                always welcome.
              </p>
            </div>

          </div>

        </div>
      </section>

      <footer className="border-t border-[#ebe5f0] bg-white px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[#8d8492] sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2026 ExactKB. All rights reserved.
          </p>

          <div className="flex gap-5">
            <a href="/">Home</a>
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>

        </div>
      </footer>

    </main>
  );
}