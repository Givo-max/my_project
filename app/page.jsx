"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera, Upload, ScanLine, Sun, Moon, RefreshCw, Loader2, ChevronRight,
  X, Image as ImageIcon, Sparkles, ShieldCheck, AlertTriangle, CheckCircle2,
  XCircle, Info, Flame, Droplet, Heart, Dumbbell, Baby, Users, ArrowLeft, Check
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Givo Food Scanner — premium, glassmorphic AI food-scanning experience. */
/*  The AI call goes through /api/analyze, a server route that keeps the  */
/*  Anthropic API key private (see app/api/analyze/route.js).             */
/* ---------------------------------------------------------------------- */

const TIPS = [
  "Reading ingredients from the image…",
  "Cross-checking nutrient density…",
  "Estimating serving size…",
  "Calculating your health score…",
];

const SUITABILITY_META = [
  { key: "weightLoss", label: "Weight Loss", icon: Flame },
  { key: "muscleGain", label: "Muscle Gain", icon: Dumbbell },
  { key: "diabetics", label: "Diabetics", icon: Droplet },
  { key: "heart", label: "Heart Patients", icon: Heart },
  { key: "kids", label: "Kids", icon: Baby },
  { key: "elderly", label: "Elderly", icon: Users },
];

const TAG_STYLES = {
  Good: { light: "bg-emerald-100 text-emerald-700 border-emerald-200", dark: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30" },
  Moderate: { light: "bg-amber-100 text-amber-700 border-amber-200", dark: "bg-amber-400/10 text-amber-300 border-amber-400/30" },
  Avoid: { light: "bg-rose-100 text-rose-700 border-rose-200", dark: "bg-rose-400/10 text-rose-300 border-rose-400/30" },
};

function useTheme(darkMode) {
  return {
    bg: darkMode ? "bg-slate-950" : "bg-emerald-50",
    text: darkMode ? "text-emerald-50" : "text-slate-900",
    sub: darkMode ? "text-slate-400" : "text-slate-500",
    card: darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/90",
    cardSoft: darkMode ? "bg-white/5 border-white/5" : "bg-white/50 border-white/70",
    chip: darkMode ? "bg-white/10 border-white/10 text-slate-200" : "bg-black/5 border-black/5 text-slate-700",
    divider: darkMode ? "border-white/10" : "border-black/5",
  };
}

function GlassCard({ children, className = "", darkMode, soft = false }) {
  const t = useTheme(darkMode);
  return (
    <div className={`rounded-3xl border backdrop-blur-xl shadow-xl ${soft ? t.cardSoft : t.card} ${className}`}>
      {children}
    </div>
  );
}

function MeshBackground({ darkMode }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className={`absolute -top-32 -left-24 w-96 h-96 rounded-full blur-3xl ${darkMode ? "bg-emerald-500/10" : "bg-emerald-300/40"}`} />
      <div className={`absolute top-1/3 -right-24 w-96 h-96 rounded-full blur-3xl ${darkMode ? "bg-amber-400/10" : "bg-amber-200/50"}`} />
      <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${darkMode ? "bg-teal-500/10" : "bg-teal-200/40"}`} />
    </div>
  );
}

function ViewfinderFrame({ children, active }) {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-black/80 w-full" style={{ aspectRatio: "3 / 4" }}>
      {children}
      {["top-4 left-4 border-t-2 border-l-2", "top-4 right-4 border-t-2 border-r-2", "bottom-4 left-4 border-b-2 border-l-2", "bottom-4 right-4 border-b-2 border-r-2"].map((pos, i) => (
        <div key={i} className={`absolute w-8 h-8 rounded-sm border-amber-400/80 ${pos}`} />
      ))}
      {active && (
        <div className="absolute inset-x-4 top-4 bottom-4 overflow-hidden rounded-2xl">
          <div className="scan-line" />
        </div>
      )}
    </div>
  );
}

function HealthRing({ score, darkMode, size = 132 }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const [dash, setDash] = useState(c);
  const color = score >= 70 ? "#1F9D6C" : score >= 40 ? "#E8A33D" : "#E85D4F";
  useEffect(() => {
    const id = requestAnimationFrame(() => setDash(c - (score / 100) * c));
    return () => cancelAnimationFrame(id);
  }, [score, c]);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 132 132" className="-rotate-90">
        <circle cx="66" cy="66" r={r} fill="none" strokeWidth="10" className={darkMode ? "stroke-white/10" : "stroke-black/5"} />
        <circle
          cx="66" cy="66" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
          stroke={color} strokeDasharray={c} strokeDashoffset={dash}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold tabular-nums" style={{ color }}>{score}</span>
        <span className={`text-xs tracking-wide uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Health Score</span>
      </div>
    </div>
  );
}

function MacroBar({ label, value, unit, max, color, darkMode }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className={`text-sm ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{label}</span>
        <span className="font-mono text-sm tabular-nums font-medium">{value}{unit}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-black/5"}`}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function MicroStat({ label, value, darkMode }) {
  const t = useTheme(darkMode);
  return (
    <div className={`rounded-2xl border p-3.5 ${t.chip}`}>
      <div className="text-xs uppercase tracking-wide opacity-70 mb-1">{label}</div>
      <div className="font-mono text-base font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const map = {
    Healthy: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    Moderate: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    Unhealthy: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  };
  const Icon = category === "Healthy" ? CheckCircle2 : category === "Unhealthy" ? XCircle : Info;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${map[category] || map.Moderate}`}>
      <Icon size={13} /> {category}
    </span>
  );
}

function DietBadge({ label, ok }) {
  if (ok === undefined || ok === null) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
      ok === true || ok === "Yes"
        ? "bg-teal-500/10 text-teal-600 border-teal-500/25"
        : ok === "Unclear"
        ? "bg-slate-500/10 text-slate-500 border-slate-500/20"
        : "bg-slate-400/10 text-slate-400 border-slate-400/20 line-through opacity-60"
    }`}>
      {label}
    </span>
  );
}

async function analyzeImage(dataUrl) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: dataUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Analysis failed.");
  return data;
}

/* -------------------------------- Page ---------------------------------- */

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState("landing");
  const [tab, setTab] = useState("camera");
  const [imageSrc, setImageSrc] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = useTheme(darkMode);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e) {
      setCameraError("Camera access isn't available. Upload a photo instead.");
      setTab("upload");
    }
  }, []);

  useEffect(() => {
    if (view === "scan" && tab === "camera" && !imageSrc) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [view, tab, imageSrc, startCamera, stopCamera]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const id = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 1400);
    return () => clearInterval(id);
  }, [isAnalyzing]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    setImageSrc(canvas.toDataURL("image/jpeg", 0.9));
    stopCamera();
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImageSrc(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setView("scan");
    setTab("camera");
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const parsed = await analyzeImage(imageSrc);
      setResult(parsed);
      setView("result");
    } catch (e) {
      setError(e.message || "Couldn't read that plate clearly. Try again with better lighting.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${t.bg} ${t.text}`}>
      <MeshBackground darkMode={darkMode} />

      <header className="max-w-5xl mx-auto px-5 sm:px-8 pt-6 flex items-center justify-between">
        <button onClick={() => setView("landing")} className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight">
          <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? "bg-emerald-400/15" : "bg-emerald-600/10"}`}>
            <ScanLine size={17} className={darkMode ? "text-emerald-300" : "text-emerald-700"} />
          </span>
          Givo
        </button>
        <button aria-label="Toggle dark mode" onClick={() => setDarkMode((d) => !d)} className={`w-10 h-10 rounded-full border flex items-center justify-center ${t.chip}`}>
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
        {view === "landing" && <LandingView darkMode={darkMode} t={t} onScan={() => setView("scan")} />}

        {view === "scan" && (
          <ScanView
            darkMode={darkMode} t={t} tab={tab} setTab={setTab}
            imageSrc={imageSrc} setImageSrc={setImageSrc}
            videoRef={videoRef} canvasRef={canvasRef}
            cameraError={cameraError} capturePhoto={capturePhoto}
            handleFile={handleFile} fileInputRef={fileInputRef}
            isAnalyzing={isAnalyzing} tipIndex={tipIndex}
            error={error} runAnalysis={runAnalysis}
            onBack={() => { stopCamera(); setImageSrc(null); setError(null); setView("landing"); }}
          />
        )}

        {view === "result" && result && (
          <ResultView darkMode={darkMode} t={t} result={result} imageSrc={imageSrc} onReset={reset} />
        )}
      </main>
    </div>
  );
}

function LandingView({ darkMode, t, onScan }) {
  const features = [
    { icon: ScanLine, title: "Instant camera scan", body: "Point your camera at any meal and get a read in seconds." },
    { icon: Sparkles, title: "Full nutrition breakdown", body: "Calories, macros, vitamins and minerals, all in one card." },
    { icon: ShieldCheck, title: "Personal health guidance", body: "See if a meal fits your goals — from weight loss to diabetes care." },
  ];
  return (
    <div className="pt-10 sm:pt-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="fade-in">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border mb-5 ${t.chip}`}>
            <Sparkles size={12} /> AI-powered nutrition, from a single photo
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-tight">
            Point, scan, and know<br /> exactly what&apos;s on your plate.
          </h1>
          <p className={`mt-5 text-base sm:text-lg max-w-md ${t.sub}`}>
            Givo reads any meal from a photo and breaks it down into calories, macros,
            vitamins, allergy flags, and health guidance — instantly.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onScan}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-medium text-white shadow-lg transition-transform active:scale-95 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #1F9D6C, #15866B)" }}
            >
              <Camera size={18} /> Scan your food
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <span className={`text-xs ${t.sub}`}>No account needed · Works on mobile</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-10">
            {features.map((f, i) => (
              <GlassCard key={i} darkMode={darkMode} soft className="p-4">
                <f.icon size={18} className={darkMode ? "text-amber-300" : "text-amber-600"} />
                <div className="mt-2 text-sm font-medium">{f.title}</div>
                <div className={`text-xs mt-1 ${t.sub}`}>{f.body}</div>
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end fade-in">
          <div className="float-slow">
            <GlassCard darkMode={darkMode} className="p-6 w-72">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-black/5"}`}>
                  <ImageIcon size={22} className={t.sub} />
                </div>
                <div>
                  <div className="font-medium text-sm">Grilled Salmon Bowl</div>
                  <div className={`text-xs ${t.sub}`}>~1 serving · 420 kcal</div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-5">
                <HealthRing score={86} darkMode={darkMode} size={92} />
                <div className="flex-1 space-y-3">
                  <MacroBar label="Protein" value={34} unit="g" max={50} color="#1F9D6C" darkMode={darkMode} />
                  <MacroBar label="Carbs" value={28} unit="g" max={80} color="#E8A33D" darkMode={darkMode} />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <CategoryBadge category="Healthy" />
                <DietBadge label="Halal" ok="Yes" />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScanView({
  darkMode, t, tab, setTab, imageSrc, setImageSrc, videoRef, canvasRef,
  cameraError, capturePhoto, handleFile, fileInputRef, isAnalyzing, tipIndex,
  error, runAnalysis, onBack,
}) {
  return (
    <div className="pt-6 sm:pt-10 max-w-md mx-auto fade-in">
      <button onClick={onBack} className={`inline-flex items-center gap-1.5 text-sm mb-5 ${t.sub}`}>
        <ArrowLeft size={15} /> Back
      </button>

      <GlassCard darkMode={darkMode} className="p-5">
        {!imageSrc && (
          <>
            <div className={`flex rounded-xl p-1 mb-4 gap-1 border ${darkMode ? "border-white/10 bg-white/5" : "border-black/5 bg-black/5"}`}>
              {[{ id: "camera", label: "Camera", icon: Camera }, { id: "upload", label: "Upload", icon: Upload }].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setTab(b.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === b.id ? (darkMode ? "bg-white/10 text-white" : "bg-white shadow text-slate-900") : t.sub
                  }`}
                >
                  <b.icon size={15} /> {b.label}
                </button>
              ))}
            </div>

            {tab === "camera" ? (
              <div>
                <ViewfinderFrame active={!isAnalyzing}>
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/80">
                      {cameraError}
                    </div>
                  )}
                </ViewfinderFrame>
                <canvas ref={canvasRef} className="hidden" />
                <button
                  onClick={capturePhoto}
                  disabled={!!cameraError}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl font-medium text-white disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #1F9D6C, #15866B)" }}
                >
                  <ScanLine size={18} /> Capture &amp; scan
                </button>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                  darkMode ? "border-white/15 hover:bg-white/5" : "border-black/10 hover:bg-black/5"
                }`}
                style={{ aspectRatio: "3 / 4" }}
              >
                <Upload size={26} className={t.sub} />
                <span className="text-sm font-medium">Tap to upload a photo</span>
                <span className={`text-xs ${t.sub}`}>JPG or PNG</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
              </label>
            )}
          </>
        )}

        {imageSrc && !isAnalyzing && (
          <div>
            <div className="rounded-2xl overflow-hidden w-full" style={{ aspectRatio: "3 / 4" }}>
              <img src={imageSrc} alt="Captured food" className="w-full h-full object-cover" />
            </div>
            {error && (
              <div className={`mt-4 flex items-start gap-2 text-sm rounded-xl p-3 border ${darkMode ? "bg-rose-400/10 border-rose-400/20 text-rose-300" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}
            <div className="mt-5 flex gap-3">
              <button onClick={() => setImageSrc(null)} className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-medium border ${t.chip}`}>
                <RefreshCw size={16} /> Retake
              </button>
              <button
                onClick={runAnalysis}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-white"
                style={{ background: "linear-gradient(135deg, #E8A33D, #DB8B1E)" }}
              >
                <Sparkles size={16} /> Analyze
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="relative">
            <div className="rounded-2xl overflow-hidden w-full relative" style={{ aspectRatio: "3 / 4" }}>
              <img src={imageSrc} alt="Analyzing" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-4 overflow-hidden rounded-xl">
                <div className="scan-line" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30">
                <Loader2 size={28} className="animate-spin text-amber-300" />
                <span className="text-white text-sm font-medium px-4 text-center">{TIPS[tipIndex]}</span>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function ResultView({ darkMode, t, result, imageSrc, onReset }) {
  const r = result;
  const suggestions = r.suggestions || [];
  const hasAllergies = (r.allergies || []).length > 0;

  return (
    <div className="pt-6 sm:pt-10 max-w-3xl mx-auto fade-in space-y-5">
      <button onClick={onReset} className={`inline-flex items-center gap-1.5 text-sm ${t.sub}`}>
        <ArrowLeft size={15} /> Scan another
      </button>

      <GlassCard darkMode={darkMode} className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          {imageSrc && <img src={imageSrc} alt={r.name} className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-2xl" />}
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold">{r.name}</h2>
            <p className={`text-sm mt-0.5 ${t.sub}`}>Estimated serving · {r.serving}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <CategoryBadge category={r.category} />
              {r.diet && (
                <>
                  <DietBadge label="Halal" ok={r.diet.halal} />
                  <DietBadge label="Vegetarian" ok={r.diet.vegetarian} />
                  <DietBadge label="Vegan" ok={r.diet.vegan} />
                </>
              )}
            </div>
          </div>
          <HealthRing score={r.healthScore ?? 0} darkMode={darkMode} />
        </div>
      </GlassCard>

      <GlassCard darkMode={darkMode} className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={16} className="text-amber-500" />
          <span className="font-medium">{r.calories} kcal</span>
          <span className={`text-xs ${t.sub}`}>per serving</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          <MacroBar label="Protein" value={r.protein} unit="g" max={60} color="#1F9D6C" darkMode={darkMode} />
          <MacroBar label="Carbohydrates" value={r.carbs} unit="g" max={100} color="#E8A33D" darkMode={darkMode} />
          <MacroBar label="Fat" value={r.fat} unit="g" max={50} color="#E85D4F" darkMode={darkMode} />
          <MacroBar label="Fiber" value={r.fiber} unit="g" max={20} color="#3A8FBD" darkMode={darkMode} />
          <MacroBar label="Sugar" value={r.sugar} unit="g" max={40} color="#C77DD0" darkMode={darkMode} />
          <MacroBar label="Water content" value={r.water} unit="%" max={100} color="#4CB8C4" darkMode={darkMode} />
        </div>
      </GlassCard>

      <GlassCard darkMode={darkMode} className="p-5 sm:p-6">
        <div className="font-medium mb-4">Vitamins &amp; minerals</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MicroStat label="Sodium" value={`${r.sodium} mg`} darkMode={darkMode} />
          <MicroStat label="Potassium" value={`${r.potassium} mg`} darkMode={darkMode} />
          <MicroStat label="Calcium" value={`${r.calcium} mg`} darkMode={darkMode} />
          <MicroStat label="Iron" value={`${r.iron} mg`} darkMode={darkMode} />
          <MicroStat label="Magnesium" value={`${r.magnesium} mg`} darkMode={darkMode} />
          <MicroStat label="Cholesterol" value={`${r.cholesterol} mg`} darkMode={darkMode} />
          <MicroStat label="Vitamin A" value={r.vitaminA} darkMode={darkMode} />
          <MicroStat label="Vitamin C" value={r.vitaminC} darkMode={darkMode} />
          <MicroStat label="Vitamin D" value={r.vitaminD} darkMode={darkMode} />
          <MicroStat label="Vitamin B12" value={r.vitaminB12} darkMode={darkMode} />
        </div>
        {r.dailyIntake && (
          <div className={`mt-5 pt-4 border-t ${darkMode ? "border-white/5" : "border-black/5"}`}>
            <div className={`text-xs mb-3 ${t.sub}`}>% of daily reference intake (2000 kcal diet)</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["calories", "protein", "carbs", "fat"].map((k) => (
                <div key={k}>
                  <div className="text-xs capitalize mb-1">{k}</div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-black/5"}`}>
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, r.dailyIntake[k])}%` }} />
                  </div>
                  <div className="font-mono text-xs mt-1">{r.dailyIntake[k]}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {r.ingredients?.length > 0 && (
        <GlassCard darkMode={darkMode} className="p-5 sm:p-6">
          <div className="font-medium mb-3">Estimated ingredients</div>
          <div className="flex flex-wrap gap-2">
            {r.ingredients.map((ing, i) => (
              <span key={i} className={`text-xs px-3 py-1.5 rounded-full border ${t.chip}`}>{ing}</span>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <GlassCard darkMode={darkMode} className="p-5 sm:p-6">
          <div className="flex items-center gap-2 font-medium mb-3">
            <CheckCircle2 size={16} className="text-emerald-500" /> Health benefits
          </div>
          <ul className="space-y-2 text-sm">
            {(r.benefits || []).map((b, i) => (
              <li key={i} className="flex gap-2"><Check size={14} className="mt-0.5 text-emerald-500 shrink-0" />{b}</li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard darkMode={darkMode} className="p-5 sm:p-6">
          <div className="flex items-center gap-2 font-medium mb-3">
            <AlertTriangle size={16} className="text-rose-500" /> Possible risks
          </div>
          <ul className="space-y-2 text-sm">
            {(r.risks || []).map((b, i) => (
              <li key={i} className="flex gap-2"><X size={14} className="mt-0.5 text-rose-500 shrink-0" />{b}</li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard darkMode={darkMode} className="p-5 sm:p-6">
        <div className="font-medium mb-4">Is this right for you?</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUITABILITY_META.map(({ key, label, icon: Icon }) => {
            const val = r.suitability?.[key] || "Moderate";
            const style = TAG_STYLES[val] || TAG_STYLES.Moderate;
            return (
              <div key={key} className={`rounded-2xl border p-3 ${darkMode ? style.dark : style.light}`}>
                <Icon size={16} />
                <div className="text-xs font-medium mt-2">{label}</div>
                <div className="text-xs mt-0.5 opacity-80">{val}</div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {hasAllergies && (
        <GlassCard darkMode={darkMode} className={`p-5 sm:p-6 border-2 ${darkMode ? "border-rose-400/30" : "border-rose-300/60"}`}>
          <div className="flex items-center gap-2 font-medium mb-2 text-rose-500">
            <AlertTriangle size={16} /> Allergy warnings
          </div>
          <div className="flex flex-wrap gap-2">
            {r.allergies.map((a, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/25">{a}</span>
            ))}
          </div>
        </GlassCard>
      )}

      {suggestions.length > 0 && (
        <GlassCard darkMode={darkMode} className="p-5 sm:p-6">
          <div className="flex items-center gap-2 font-medium mb-3">
            <Sparkles size={16} className="text-amber-500" /> Givo suggests
          </div>
          <ul className="space-y-2 text-sm">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-2"><ChevronRight size={14} className="mt-0.5 text-amber-500 shrink-0" />{s}</li>
            ))}
          </ul>
        </GlassCard>
      )}

      <p className={`text-center text-xs pt-2 ${t.sub}`}>
        Estimates are AI-generated from a single photo and may not be fully accurate. Not a substitute for medical or professional dietary advice.
      </p>
    </div>
  );
}
