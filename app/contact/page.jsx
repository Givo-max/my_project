import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata = { title: "Contact Us — Givo Food Analyzer" };

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-emerald-50 text-slate-900 px-5 sm:px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Givo
        </Link>
        <h1 className="font-display text-3xl font-semibold mt-4 mb-6">Contact Us</h1>
        <div className="bg-white/70 border border-white rounded-3xl p-6 sm:p-8 space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Have questions, feature suggestions, or technical business inquiries regarding the
            Givo Food Analyzer AI framework?
          </p>
          <p>Feel free to reach out to our technical management desk directly via our support email:</p>
          <p className="flex items-center gap-2 font-medium text-emerald-700">
            <Mail size={16} />
            <a href="mailto:info@givofoodanalyzer.com" className="hover:underline">
              info@givofoodanalyzer.com
            </a>
          </p>
          <p>We aim to respond to all technical and user queries within 48 business hours.</p>
        </div>
      </div>
    </main>
  );
}
