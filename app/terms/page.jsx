import Link from "next/link";

export const metadata = { title: "Terms of Service — Givo Food Scanner" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-emerald-50 text-slate-900 px-5 sm:px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Givo
        </Link>
        <h1 className="font-display text-3xl font-semibold mt-4 mb-6">Terms of Service</h1>
        <div className="bg-white/70 border border-white rounded-3xl p-6 sm:p-8 space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            By accessing and using Givo Food Scanner, you agree to comply with our standard
            terms of use.
          </p>
          <p>
            <strong>Usage Scope:</strong> This application provides estimated nutritional values
            using automated AI vision models. It should be used strictly for information,
            fitness logging, and educational guidelines.
          </p>
          <p>
            <strong>Liability Disclaimer:</strong> Givo Food Scanner is not responsible for any
            clinical dietary complications, macro calculation mismatches, or food allergies.
            Always cross-verify food analysis logs with clinical health supervisors or doctors.
          </p>
        </div>
      </div>
    </main>
  );
}
