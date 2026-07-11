import Link from "next/link";

export const metadata = { title: "About Us — Givo Food Scanner" };

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-emerald-50 text-slate-900 px-5 sm:px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Givo
        </Link>
        <h1 className="font-display text-3xl font-semibold mt-4 mb-6">About Us</h1>
        <div className="bg-white/70 border border-white rounded-3xl p-6 sm:p-8 space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Welcome to Givo Food Scanner, an intelligent web-utility platform engineered to
            simplify daily macro tracking and automated dietary analysis.
          </p>
          <p>
            Our application uses advanced computer vision artificial intelligence to read
            uploaded or captured food pictures, generating immediate details on calories,
            minerals, proteins, and diabetic suitability metrics. Our mission is to make smart
            nutrition and active healthy lifestyle management universally accessible with zero
            friction.
          </p>
        </div>
      </div>
    </main>
  );
}
