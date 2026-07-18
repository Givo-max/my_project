"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-emerald-50 text-slate-900 px-5 sm:px-8 py-10 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <Link href="/login" className="text-sm text-slate-500 hover:underline">
          ← Back to login
        </Link>
        <div className="bg-white/70 border border-white rounded-3xl p-6 sm:p-8 mt-4">
          <h1 className="font-display text-2xl font-semibold mb-1">Reset your password</h1>
          <p className="text-sm text-slate-500 mb-6">
            Enter your account email and we&apos;ll send you a reset link.
          </p>

          {done ? (
            <div className="flex items-start gap-2 text-sm rounded-xl p-3 border bg-emerald-50 border-emerald-100 text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-start gap-2 text-sm rounded-xl p-3 border bg-rose-50 border-rose-100 text-rose-700 mb-4">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Email</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5">
                    <Mail size={16} className="text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full outline-none text-sm bg-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-white disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #1F9D6C, #15866B)" }}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Send reset link
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

