"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, AlertTriangle, LogOut, KeyRound, Trash2, ShieldCheck } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [historyCleared, setHistoryCleared] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push("/login?next=/account");
        return;
      }
      setUser(currentUser);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("role, must_change_password")
        .eq("id", currentUser.id)
        .single();
      setProfile(profileData);
      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleClearHistory = () => {
    try {
      window.localStorage.removeItem("givo_scan_history");
      setHistoryCleared(true);
    } catch {
      setHistoryCleared(true);
    }
  };

  const handleDeleteAccount = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete account.");
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-emerald-600" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-emerald-50 text-slate-900 px-5 sm:px-8 py-10">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Back to Givo
        </Link>
        <h1 className="font-display text-3xl font-semibold mt-4 mb-6">Your account</h1>

        <div className="bg-white/70 border border-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Email</div>
            <div className="font-medium">{user?.email}</div>
            {profile?.role === "admin" && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/25">
                <ShieldCheck size={12} /> Admin
              </span>
            )}
          </div>

          <div className="border-t border-black/5 pt-5 space-y-3">
            <Link
              href="/account/change-password"
              className="w-full inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5"
            >
              <KeyRound size={16} /> Change password
            </Link>

            <button
              onClick={handleClearHistory}
              className="w-full inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5"
            >
              <Trash2 size={16} /> Clear scan history on this device
            </button>
            {historyCleared && <p className="text-xs text-emerald-700">Scan history cleared.</p>}

            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border border-black/10 hover:bg-black/5"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>

          <div className="border-t border-rose-100 pt-5">
            {error && (
              <div className="flex items-start gap-2 text-sm rounded-xl p-3 border bg-rose-50 border-rose-100 text-rose-700 mb-3">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-rose-600 hover:underline"
              >
                Delete my account
              </button>
            ) : (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-sm text-rose-700 mb-3">
                  This permanently deletes your account and cannot be undone. Are you sure?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={busy}
                    className="text-sm font-medium px-4 py-2 rounded-xl bg-rose-600 text-white disabled:opacity-60"
                  >
                    {busy ? "Deleting…" : "Yes, delete permanently"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-sm font-medium px-4 py-2 rounded-xl border border-black/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

