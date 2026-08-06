import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the ExactKB Privacy Policy and learn how the website handles information and image processing.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-[#8b8190]">
            Last updated: August 6, 2026
          </p>

          <div className="mt-10 space-y-9 leading-7 text-[#6f6578]">

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                1. Introduction
              </h2>

              <p className="mt-3">
                ExactKB respects your privacy. This Privacy Policy
                explains how information may be handled when you use
                the ExactKB website and image compression tool.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                2. Image processing
              </h2>

              <p className="mt-3">
                The current image compression functionality is designed
                to process selected images directly in your browser.
                The website does not require you to create an account
                to use the basic compression functionality.
              </p>

              <p className="mt-3">
                You should always keep your original files and avoid
                uploading confidential information to any online
                service unless you understand how that service works.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                3. Information you provide
              </h2>

              <p className="mt-3">
                If you contact ExactKB by email, we may receive the
                information you voluntarily include in your message,
                such as your email address and the contents of your
                enquiry.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                4. Log and technical information
              </h2>

              <p className="mt-3">
                Hosting providers, analytics services or other
                infrastructure used by the website may process
                technical information such as IP address, browser
                type, device information, approximate location and
                access times as part of normal web operations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                5. Cookies and advertising
              </h2>

              <p className="mt-3">
                ExactKB may use cookies or similar technologies in the
                future to support website functionality, understand
                usage and display advertising.
              </p>

              <p className="mt-3">
                If Google AdSense or another advertising provider is
                enabled, that provider may use cookies or similar
                technologies to provide and measure advertisements in
                accordance with its own policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                6. Third-party services
              </h2>

              <p className="mt-3">
                ExactKB may use third-party services for hosting,
                security, analytics, advertising or other website
                operations. Those services may process information
                according to their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                7. Children's privacy
              </h2>

              <p className="mt-3">
                ExactKB is not specifically directed at children and
                does not knowingly request personal information from
                children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                8. Changes to this policy
              </h2>

              <p className="mt-3">
                This Privacy Policy may be updated when the website,
                services or legal requirements change. The latest
                version will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#211b2b]">
                9. Contact
              </h2>

              <p className="mt-3">
                If you have questions about this Privacy Policy, please
                contact ExactKB through the Contact page.
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
            <a href="/terms">Terms</a>
          </div>

        </div>
      </footer>

    </main>
  );
}