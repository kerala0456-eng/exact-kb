"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#faf9fc] text-[#211b2b]">

      {/* Header */}
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

      {/* Content */}
      <section className="px-5 py-14 sm:py-20">

        <div className="mx-auto max-w-4xl">

          <div className="text-center">

            <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-600">
              Contact
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Get in touch
            </h1>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#766d7e]">
              Have a question, suggestion, feedback, or found
              a problem with ExactKB? Send us a message.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-5">

            {/* Info */}
            <div className="md:col-span-2">

              <div className="h-full rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl">
                  💬
                </div>

                <h2 className="mt-6 text-xl font-black">
                  We would love to hear from you
                </h2>

                <p className="mt-3 leading-7 text-[#766d7e]">
                  Your feedback helps us improve ExactKB and
                  build useful tools for everyone.
                </p>

                <div className="mt-8 space-y-4">

                  <div className="rounded-xl bg-[#faf8fd] p-4">

                    <p className="text-xs font-bold uppercase tracking-wide text-[#9a91a1]">
                      Website
                    </p>

                    <p className="mt-1 font-bold">
                      ExactKB
                    </p>

                  </div>

                  <div className="rounded-xl bg-[#faf8fd] p-4">

                    <p className="text-xs font-bold uppercase tracking-wide text-[#9a91a1]">
                      Response
                    </p>

                    <p className="mt-1 font-bold">
                      We aim to respond as soon as possible.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Form */}
            <div className="md:col-span-3">

              <div className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

                {submitted ? (

                  <div className="py-12 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
                      ✓
                    </div>

                    <h2 className="mt-5 text-2xl font-black">
                      Message received
                    </h2>

                    <p className="mx-auto mt-3 max-w-md leading-7 text-[#766d7e]">
                      Thank you for contacting ExactKB.
                      Your message has been prepared successfully.
                    </p>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-7 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-700"
                    >
                      Send another message
                    </button>

                  </div>

                ) : (

                  <form onSubmit={handleSubmit}>

                    <h2 className="text-xl font-black">
                      Send us a message
                    </h2>

                    <div className="mt-6 space-y-5">

                      <div>

                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-bold"
                        >
                          Name
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Your name"
                          className="w-full rounded-xl border border-[#e2dce8] bg-white px-4 py-3.5 outline-none transition placeholder:text-[#b0a7b5] focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />

                      </div>

                      <div>

                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-bold"
                        >
                          Email
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-[#e2dce8] bg-white px-4 py-3.5 outline-none transition placeholder:text-[#b0a7b5] focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />

                      </div>

                      <div>

                        <label
                          htmlFor="subject"
                          className="mb-2 block text-sm font-bold"
                        >
                          Subject
                        </label>

                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          placeholder="How can we help?"
                          className="w-full rounded-xl border border-[#e2dce8] bg-white px-4 py-3.5 outline-none transition placeholder:text-[#b0a7b5] focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />

                      </div>

                      <div>

                        <label
                          htmlFor="message"
                          className="mb-2 block text-sm font-bold"
                        >
                          Message
                        </label>

                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          placeholder="Write your message..."
                          className="w-full resize-none rounded-xl border border-[#e2dce8] bg-white px-4 py-3.5 outline-none transition placeholder:text-[#b0a7b5] focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        />

                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        Send Message
                      </button>

                    </div>

                  </form>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-[#ebe5f0] bg-white px-5 py-8 text-center text-sm text-[#968c9d]">
        © 2026 ExactKB. All rights reserved.
      </footer>

    </main>
  );
}