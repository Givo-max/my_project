"use client";

import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, ShieldCheck, ArrowLeft, History, Activity, Flame } from 'lucide-react';

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState("landing");
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('givo_meal_history');
    if (saved) setHistoryList(JSON.parse(saved));
  }, []);

  const triggerMockScan = () => {
    const mockItem = {
      id: Date.now(),
      name: "Grilled Salmon Bowl",
      date: new Date().toLocaleDateString(),
      calories: 420, protein: 34, carbs: 28, fat: 18
    };
    const updated = [mockItem, ...historyList].slice(0, 5);
    setHistoryList(updated);
    localStorage.setItem('givo_meal_history', JSON.stringify(updated));
    setView("landing");
  };

  return (
    <div className={`min-h-screen font-sans p-6 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("landing")}>
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">G</div>
          <span className="text-xl font-bold tracking-tight text-teal-600">Givo AI</span>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl border border-black/5 bg-white shadow-sm dark:bg-white/5 dark:border-white/10">
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <main className="max-w-xl mx-auto py-12 text-center">
        {view === "landing" ? (
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-600 dark:bg-white/5 dark:text-teal-400">✨ AI Food Nutrition Scanner</span>
            <h1 className="text-4xl font-black tracking-tight mt-4 leading-tight">Point, scan, and know exactly what's on your plate.</h1>
            <p className="text-sm opacity-60 mt-3 max-w-sm mx-auto">Givo reads any meal from a photo and breaks it down into calories, protein, and health metrics instantly.</p>
            <button onClick={() => setView("scan")} className="mt-8 px-6 py-3 rounded-2xl text-white font-medium shadow-md hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg, #1F9D6C, #15866B)" }}>
              📷 Open Food Scanner
            </button>

            {/* GOOGLE ADSENSE PLACEHOLDER 1 */}
            <div className="w-full h-20 my-8 rounded-xl border border-dashed flex items-center justify-center text-[10px] font-mono opacity-40 bg-black/5 border-black/10 dark:bg-white/5 dark:border-white/10">
              [ AdSense Advertisement Area - Top Banner ]
            </div>

            {/* DYNAMIC INTEGRATED HISTORY SECTION */}
            <section className="mt-12 text-left">
              <h3 className="text-sm font-bold tracking-wider uppercase opacity-60 flex items-center gap-1.5 mb-3">
                <History size={14} className="text-teal-600" /> Recent Scans (Saved Locally)
              </h3>
              {historyList.length === 0 ? (
                <p className="text-xs italic opacity-50 p-4 border border-dashed rounded-xl text-center">No recent scans found. Items save automatically here.</p>
              ) : (
                <div className="space-y-2">
                  {historyList.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl border flex justify-between items-center bg-white border-slate-100 dark:bg-white/5 dark:border-white/5">
                      <div>
                        <h4 className="font-semibold text-xs">{item.name}</h4>
                        <span className="text-[10px] opacity-40">{item.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-teal-600">{item.calories} kcal</span>
                        <span className="text-[10px] opacity-50 block">P: {item.protein}g | C: {item.carbs}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border bg-white border-slate-100 dark:bg-white/5 dark:border-white/10 text-center">
            <button onClick={() => setView("landing")} className="text-xs opacity-60 flex items-center gap-1 mb-4 hover:opacity-100"><ArrowLeft size={12} /> Back</button>
            <div className="w-16 h-16 bg-teal-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={28} className="text-teal-600" />
            </div>
            <h3 className="font-bold text-sm">AI Computer Vision Lens Active</h3>
            <p className="text-xs opacity-60 mt-1 max-w-xs mx-auto">Click below to simulate real-time camera matrix data analysis execution handler pipeline.</p>
            <button onClick={triggerMockScan} className="w-full mt-6 py-3 rounded-xl text-xs font-bold text-white shadow-sm" style={{ background: "linear-gradient(135deg, #1F9D6C, #15866B)" }}>
              Analyze & Track Nutritional Values
            </button>
          </div>
        )}
      </main>

      {/* ─── CERTIFIED ADSENSE LEGAL FOOTER ─── */}
      <footer className="border-t max-w-4xl mx-auto mt-24 pt-8 text-center text-xs space-y-4 opacity-70">
        <p className="opacity-50">&copy; {new Date().getFullYear()} Givo Intelligence Tech. All rights reserved.</p>
        <div className="flex justify-center gap-6 font-semibold text-teal-600">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/contact" className="hover:underline">Contact Us</a>
          <a href="/public/ads.txt" className="hover:underline">ads.txt</a>
        </div>
        <p className="text-[9px] opacity-40 max-w-md mx-auto leading-relaxed border p-3 rounded-xl bg-black/5 dark:bg-white/5 border-transparent">
          Disclaimer: Givo utilizes neural network estimation for educational and caloric logging guidelines. This utility framework does not substitute professional medical dietitian advice.
        </p>
      </footer>
    </div>
  );
}
