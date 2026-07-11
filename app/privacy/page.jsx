import Link from "next/link";

export const metadata = { title: "Privacy Policy — Givo Food Scanner" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-emerald-50 text-slate-900 px-5 sm:px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Givo
        </Link>
        <h1 className="font-display text-3xl font-semibold mt-4 mb-6">Privacy Policy</h1>
        <div className="bg-white/70 border border-white rounded-3xl p-6 sm:p-8 space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            At Givo Food Scanner, we take your privacy seriously. Our food scanning tool
            utilizes your device camera or image uploads to estimate nutritional facts locally
            or via secure AI API streams.
          </p>
          <p>
            <strong>Data Protection:</strong> We do not permanently store, share, or sell your
            personal food images, gallery photos, or nutritional biometric data on our servers.
          </p>
          <p>
            <strong>Cookies &amp; Ads:</strong> Third-party vendors, including Google, use
            cookies to serve ads based on your prior visits to this website. You may opt out of
            personalized advertising by visiting Google Ads Settings.
          </p>
        </div>
      </div>
    </main>
  );
}
