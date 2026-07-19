"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Plus, Trash2, Pencil, ArrowLeft } from "lucide-react";

export default function FoodsAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [foods, setFoods] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "", category: "", calories: "", protein: "", carbs: "", fat: "", image_url: "",
  });

  useEffect(() => {
    checkAndLoad();
  }, []);

  async function checkAndLoad() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?next=/admin/foods");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") {
      setLoading(false);
      return;
    }
    setIsAdmin(true);
    await loadFoods();
    setLoading(false);
  }

  async function loadFoods() {
    const supabase = createClient();
    const { data } = await supabase
      .from("foods").select("*").order("created_at", { ascending: false });
    setFoods(data || []);
  }

  function resetForm() {
    setForm({ name: "", category: "", calories: "", protein: "", carbs: "", fat: "", image_url: "" });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      category: form.category || null,
      calories: form.calories ? Number(form.calories) : null,
      protein: form.protein ? Number(form.protein) : null,
      carbs: form.carbs ? Number(form.carbs) : null,
      fat: form.fat ? Number(form.fat) : null,
      image_url: form.image_url || null,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from("foods").update(payload).eq("id", editingId);
    } else {
      await supabase.from("foods").insert(payload);
    }
    resetForm();
    await loadFoods();
    setSaving(false);
  }

  function startEdit(food) {
    setEditingId(food.id);
    setForm({
      name: food.name || "",
      category: food.category || "",
      calories: food.calories ?? "",
      protein: food.protein ?? "",
      carbs: food.carbs ?? "",
      fat: food.fat ?? "",
      image_url: food.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this food item?")) return;
    const supabase = createClient();
    await supabase.from("foods").delete().eq("id", id);
    await loadFoods();
  }

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
          <Link href="/" className="text-sm text-slate-400 hover:underline">← Back to Givo</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-emerald-50 px-5 sm:px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:underline mb-6">
          <ArrowLeft size={14} /> Back to Admin
        </Link>

        <h1 className="font-display text-2xl font-semibold mb-6">Food Database</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6 space-y-3">
          <div className="text-sm font-medium mb-2">
            {editingId ? "Edit Food" : "Add New Food"}
          </div>
          <input
            required
            placeholder="Name (e.g. Chicken Biryani)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
          />
          <input
            placeholder="Category (e.g. Rice Dishes)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input
              type="number" placeholder="Calories"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              className="text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
            />
            <input
              type="number" placeholder="Protein (g)"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
              className="text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
            />
            <input
              type="number" placeholder="Carbs (g)"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
              className="text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
            />
            <input
              type="number" placeholder="Fat (g)"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
              className="text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
            />
          </div>
          <input
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
          />
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-500"
            >
              <Plus size={15} /> {saving ? "Saving..." : editingId ? "Update Food" : "Add Food"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm px-4 py-2 rounded-xl border border-white/15 hover:bg-white/5"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-medium mb-4">Foods ({foods.length})</div>
          <div className="space-y-2">
            {foods.map((food) => (
              <div key={food.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{food.name}</div>
                  <div className="text-xs text-slate-400">
                    {food.category || "—"} · {food.calories ?? "?"} kcal
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(food)} className="p-2 rounded-lg hover:bg-white/10">
                    <Pencil size={15} className="text-blue-400" />
                  </button>
                  <button onClick={() => handleDelete(food.id)} className="p-2 rounded-lg hover:bg-white/10">
                    <Trash2 size={15} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
            {foods.length === 0 && (
              <div className="text-sm text-slate-500 py-4 text-center">No foods added yet.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
