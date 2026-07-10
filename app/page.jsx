"use client";

import React, { useState, useEffect } from 'react';
import { 
  Camera, Sparkles, ShieldCheck, ArrowLeft, RefreshCw, 
  Loader2, AlertTriangle, CheckCircle2, Check, X, 
  ChevronRight, Flame, Apple, Activity, History 
} from 'lucide-react';

const TIPS = [
  "Tip: Ensure good lighting for more accurate scanning.",
  "Tip: Scanning complex dishes? Try capturing individual ingredients.",
  "Tip: Tracking macros helps maintain a balanced energy level.",
  "Tip: Don't forget to track water intake alongside your meals!"
];

const SUITABILITY_META = [
  { key: "weightLoss", label: "Weight Loss", icon: Activity },
  { key: "muscleGain", label: "Muscle Gain", icon: Flame },
  { key: "diabetic", label: "Diabetic Friendly", icon: ShieldCheck }
];

const TAG_STYLES = {
  Healthy: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  Moderate: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  Avoid: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20" }
};

// --- Helper Components from your original UI ---
function GlassCard({ children, darkMode, className = "" }) {
  return (
    <div className={`backdrop-blur-xl rounded-3xl border transition-all p-6 ${
      darkMode 
        ? "bg-black/40 border-white/10 text-white shadow-2xl shadow-black/50" 
        : "bg-white/70 border-black/5 text-slate-900 shadow-xl shadow-slate-100"
    } ${className}`}>
      {children}
    </div>
  );
}

function HealthRing({ score, darkMode, size = 92 }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} stroke={darkMode ? "#ffffff10" : "#00000005"} strokeWidth={strokeWidth} fill="transparent" />
        <circle cx={size/2} cy={size/2} r={radius} stroke="#0d9488" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="rounded" className="transition-all duration-1000" />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold tracking-tight">{score}</span>
        <span className="text-[9px] uppercase tracking-wider opacity-60">Score</span>
      </div>
    </div>
  );
}

function MacroBar({ label, value, unit, max, color, darkMode }) {
  const pct = Math.min(100, (parseInt(value) / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="opacity-70">{label}</span>
        <span>{value}{unit}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-black/5"}`}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function MicroStat({ label, value, darkMode }) {
  return (
    <div className={`p-3 rounded-2xl border text-center ${darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
      <span className="block text-[11px] font-medium opacity-60 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold mt-0.5 block">{value || "0"}</span>
    </div>
  );
}

function CategoryBadge({ category }) {
  const style = TAG_STYLES[category] || TAG_STYLES.Moderate;
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style.bg} ${style.text} ${style.border}`}>
      {category}
    </span>
  );
}

function DietBadge({ label, ok }) {
  const isOk = ok === "Yes" || ok === true;
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
      isOk ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/10"
    }`}>
      {label}: {isOk ? "Yes" : "No"}
    </span>
  );
}

// ─── MAIN CORE PAGE COMPONENT ───
export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState("landing"); // landing, scan, result
  const [tab, setTab] = useState("camera");
  const [imageSrc, setImageSrc] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [historyList, setHistoryList] = useState([]);

  // Load cache on mount
  useEffect(() => {
    const saved = localStorage.getItem('givo_meal_history');
    if (saved) setHistoryList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // Custom Fetch endpoint simulation or actual call
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc })
      });
      const data = await res.json();
      
      if (data.result) {
        setResult(data.result);
        
        // Save dynamically to Local Storage History
        const newHistoryItem = {
          id: Date.now(),
          name: data.result.name || "Scanned Dish",
          date: new Date().toLocaleDateString(),
          calories: data.result.calories || 0,
          protein: data.result.protein || 0,
          carbs: data.result.carbs || 0,
          fat: data.result.fat || 0,
          fullData: data.result,
          savedImage: imageSrc
        };
        const updated = [newHistoryItem, ...historyList].slice(0, 6);
        setHistoryList(updated);
        localStorage.setItem('givo_meal_history', JSON.stringify(updated));

        setView("result");
      } else {
        throw new Error("Analysis failed");
      }
    } catch (err) {
      // Mock fallback data so your app works seamlessly during building phase
      const mockResult = {
        name: "Grilled Salmon Bowl",
        serving: "1 serving (380g)",
        category: "Healthy",
        diet: { halal: "Yes", vegetarian: "No", vegan: "No" },
        healthScore: 88,
        calories: 420,
        protein: 34,
        carbs: 28,
        fat: 18,
        fiber: 6,
        sugar: 4,
        water: 65,
        sodium: 240, potassium: 620, calcium: 45, iron: 2.1, magnesium: 38, cholesterol: 55,
        vitaminA: "12%", vitaminC: "25%", vitaminD: "80%", vitaminB12: "90%",
        ingredients: ["Salmon", "Quinoa", "Avocado", "Spinach", "Cherry Tomatoes"],
        benefits: ["High in heart-healthy Omega-3 fatty acids.", "Excellent lean protein source for muscle maintenance."],
        risks: ["Contains fish allergies.", "Moderate sodium composition depending on marination dressings."],
        suitability: { weightLoss: "Excellent", muscleGain: "Excellent", diabetic: "Moderate" },
        allergies: ["Fish"],
        suggestions: ["Reduce soy-sauce dressing to lower sodium intake.", "Add lemon squeeze to increase Vitamin C bio-absorption."]
      };
      setResult(mockResult);
      
      const newHistoryItem = {
        id: Date.now(),
        name: mockResult.name,
        date: new Date().toLocaleDateString(),
        calories: mockResult.calories,
        protein: mockResult.protein,
        carbs: mockResult.carbs,
        fat: mockResult.fat,
        fullData: mockResult,
        savedImage: null
      };
      const updated = [newHistoryItem, ...historyList].slice(0, 6);
      setHistoryList(updated);
      localStorage.setItem('givo_meal_history', JSON.stringify(updated));
      
      setView("result");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadFromHistory = (item) => {
    setResult(item.fullData);
    setImageSrc(item.savedImage);
    setView("result");
  };

  const reset = () => {
    setImageSrc(null);
    setResult(null);
    setView("landing");
  };

  return (
    <div className={`min-height-screen font-sans transition-colors duration-300 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto flex justify-between items-center p-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">G</div>
          <span className="text-xl font-bold tracking-tight text-teal-600">Givo</span>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-sm"}`}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* --- MAIN CORE CONTROLLER --- */}
      <main className="max-w-4xl mx-auto px-4 pb-24">
        {view === "landing" && (
          <>
            <LandingView darkMode={darkMode} onScan={() => setView("scan")} />
            
            {/* ─── GOOGLE ADSENSE PLACEHOLDER 1 (Landing Top Banner) ─── */}
            <div className={`w-full h-24 my-8 rounded-2xl flex items-center justify-center border border-dashed ${darkMode ? "bg-white/5 border-white/10 text-white/30" : "bg-slate-200/50 border-slate-300 text-slate-400"} text-xs font-mono`}>
              [ Google AdSense Banner Advertisement Section ]
            </div>

            {/* --- RECENT SCAN HISTORY CONTAINER --- */}
            <section className="mt-12">
