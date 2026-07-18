"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, LogOut, ShieldCheck, Settings, Database, FileText, Users } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/login?next=/admin");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

      if (profile?.role !== "admin") {
        setUser(currentUser);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      setUser(currentUser);

      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id, email, role, created_at")
        .order("created_at", { ascending: false });
      setUsers(allProfiles || []);

      const { data: settings } = await supabase
        .from("app_settings")
        .select("ads_enabled")
        .eq("id", 1)
        .single();
      setAdsEnabled(settings?.ads_enabled ?? true);

      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const toggleAds = async () => {
    setSaving(true);
    const supabase = createClient();
    const newValue = !adsEnabled;
    const { error } = await supabase
      .from("app_settings")
      .update({ ads_enabled: newValue, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (!error) setAdsEnabled(newValue);
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-emerald-400" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-50 px-5">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
          <p className="text-slate-400 text-sm mb-6">Aapko is page ka access nahi hai.</p>
          <Link href="/" className="text-sm text-slate-400 hover:underline">← Back to Givo</Link>
        </div>
      </main>
    );
  }

  const upcoming = [
    { icon: Database, label: "Food Database", note: "Foods, ingredients, categories — coming next" },
    { icon: FileText, label: "Blog System", note: "Articles, drafts, scheduling — coming next" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-emerald-50 px-5 sm:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-1">
              <ShieldCheck size={15} /> Admin Control Center
            </div>
            <h1 className="font-display text-2xl font-semibold">Welcome, {user?.email}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>

        {/* Ads Control */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <Settings size={16} className="text-blue-400" /> AdSense Control
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Ads currently: <span className="font-semibold text-emerald-300">{adsEnabled ? "ON" : "OFF"}</span>
          </p>
          <button
            onClick={toggleAds}
            disabled={saving}
            className={`text-sm font-semibold px-4 py-2 rounded-xl ${
              adsEnabled ? "bg-red-500/80 hover:bg-red-500" : "bg-emerald-500/80 hover:bg-emerald-500"
            }`}
          >
            {saving ? "Saving..." : adsEnabled ? "Turn Ads OFF" : "Turn Ads ON"}
          </button>
        </div>

        {/* Payments placeholder */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
          <div className="text-sm font-medium mb-1">Payments / Subscriptions</div>
          <p className="text-xs text-slate-400">Coming soon — PayPro integration pending.</p>
        </div>

        {/* Users list */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium mb-4">
            <Users size={16} className="text-blue-400" /> Users ({users.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-400 border-b border-white/10">
                  <th className="pb-2 pr-2">Email</th>
                  <th className="pb-2 pr-2">Role</th>
                  <th className="pb-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="py-2 pr-2">{u.email}</td>
                    <td className="py-2 pr-2">{u.role || "user"}</td>
                    <td className="py-2">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {upcoming.map(({ icon: Icon, label, note }, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Icon size={18} className="text-blue-400" />
              <div className="font-medium text-sm mt-2">{label}</div>
              <div className="text-xs text-slate-400 mt-1">{note}</div>
            </div>
          ))}
        </div>

        <Link href="/" className="inline-block mt-8 text-sm text-slate-400 hover:underline">
          ← Back to Givo
        </Link>
      </div>
    </main>
  );
}
