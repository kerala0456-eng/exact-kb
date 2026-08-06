export default function AboutPage() {
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

      <section className="px-5 py-16 sm:py-24">

        <div className="mx-auto max-w-3xl">

          <div className="text-center">

            <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-600">
              About ExactKB
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Simple image compression
              <span className="block text-violet-600">
                for everyone.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#786f80]">
              ExactKB is a simple online image compression
              tool designed to help people reduce image file
              sizes quickly and easily.
            </p>

          </div>

          <div className="mt-14 space-y-6">

            <div className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                What is ExactKB?
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                ExactKB helps users compress images when they
                need a smaller file size for applications,
                websites, forms, documents, email and other
                online services.
              </p>

            </div>

            <div className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                Our goal
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                Our goal is to make image compression simple,
                fast and accessible without requiring users
                to install complicated software.
              </p>

            </div>

            <div className="rounded-2xl border border-[#e8e1ef] bg-white p-7 shadow-sm">

              <h2 className="text-xl font-black">
                Privacy
              </h2>

              <p className="mt-3 leading-7 text-[#766d7e]">
                The current image compression process runs
                directly in your browser. This means your
                selected image does not need to be uploaded
                to our server for the compression process.
              </p>

            </div>

          </div>

          <div className="mt-10 text-center">

            <a
              href="/"
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5"
            >
              Compress an Image
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