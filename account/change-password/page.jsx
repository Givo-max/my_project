"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Lock, Loader2, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={null}>
      <ChangePasswordForm />
    </Suspense>
  );
}

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = searchParams.get("forced") === "1";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: userData, error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setLoading(false);
      setError(updateError.message);
      return;
    }

    if (userData?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", userData.user.id)
        .select("role")
        .single();

      setLoading(false);
      setDone(true);
      setTimeout(() => {
        router.push(profile?.role === "admin" ? "/admin" : "/account");
        router.refresh();
      }, 1200);
      return;
    }

    setLoading(false);
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-emerald-50 text-slate-900 px-5 sm:px-8 py-10 flex items-center justify-center">
      <div className="w-full max-w-sm">
        {!forced && (
          <Link href="/account" className="text-sm text-slate-500 hover:underline">
            ← Back to account
          </Link>
        )}
        <div className="bg-white/70 border border-white rounded-3xl p-6 sm:p-8 mt-4">
          <h1 className="font-display text-2xl font-semibold mb-1">Change your password</h1>

          {forced && (
            <div className="flex items-start gap-2 text-sm rounded-xl p-3 border bg-amber-50 border-amber-100 text-amber-700 mb-4">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              For security, you must set a new password before continuing.
            </div>
          )}

          {done ? (
            <div className="flex items-start gap-2 text-sm rounded-xl p-3 border bg-emerald-50 border-emerald-100 text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              Password updated. Redirecting…
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
                  <label className="text-xs font-medium text-slate-600">New password</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full outline-none text-sm bg-transparent"
                      placeholder="At least 8 characters"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Confirm new password</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full outline-none text-sm bg-transparent"
                      placeholder="Re-enter password"
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
                  Update password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

