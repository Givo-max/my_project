"use client";
import React, { useState, useEffect } from 'react';

export default function GivoApp() {
  const [scanHistory, setScanHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Load History from Browser Local Storage when page opens
  useEffect(() => {
    const savedHistory = localStorage.getItem('givo_history');
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 2. Mock Function: AI Food Scan simulation and auto-saving to history
  const handleFoodScan = () => {
    setLoading(true);
    setCurrentResult(null);

    // AI Processing ki tarah 1.5 seconds ka wait
    setTimeout(() => {
      const newMeal = {
        id: Date.now(),
        name: "Grilled Salmon Bowl",
        date: new Date().toLocaleDateString(),
        calories: 450,
        protein: "35g",
        carbs: "12g",
        fat: "22g",
        minerals: "Calcium: 40mg, Magnesium: 35mg",
        description: "Grilled Salmon Bowl is an excellent source of lean protein and heart-healthy omega-3 fatty acids. Perfect for weight management and metabolic health."
      };

      setCurrentResult(newMeal);
      setLoading(false);

      // Save to History (Sirf top 10 items save honge browser mein)
      const updatedHistory = [newMeal, ...scanHistory].slice(0, 10);
      setScanHistory(updatedHistory);
      localStorage.setItem('givo_history', JSON.stringify(updatedHistory));
    }, 1500);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fbf9', color: '#1a1a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ─── HEADER SECTION ─── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#115e59', margin: 0 }}>Givo</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🌙</button>
        </div>
      </header>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main style={{ flex: 1, maxWidth: '600px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
        
        {/* Hero Headline */}
        <section style={{ textAlign: 'center', margin: '40px 0' }}>
          <p style={{ color: '#0d9488', fontWeight: '500', fontSize: '14px', margin: '0 0 10px 0' }}>✨ AI-powered nutrition, from a single photo</p>
          <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 15px 0', lineHeight: '1.2' }}>Point, scan, and know exactly what’s on your plate.</h2>
          <p style={{ color: '#666', lineHeight: '1.6', margin: 0 }}>Givo reads any meal from a photo and breaks it down into calories, macros, vitamins, allergy flags, and health guidance — instantly.</p>
          
          {/* Main Action Button */}
          <button 
            onClick={handleFoodScan} 
            disabled={loading}
            style={{ backgroundColor: '#0d9488', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '30px', fontSize: '18px', fontWeight: '600', marginTop: '25px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 10px rgba(13, 148, 136, 0.2)' }}
          >
            {loading ? "Analyzing Food..." : "📷 Scan your food >"}
          </button>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '10px', margin: '10px 0 0 0' }}>No account needed • Works on mobile</p>
        </section>

        {/* ─── ADSENSE PLACEHOLDER 1 (Top Banner) ─── */}
        <div style={{ width: '100%', height: '90px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px', borderRadius: '8px', margin: '20px 0', border: '1px dashed #cbd5e1' }}>
          [ AdSense Advertisement - Top Banner ]
        </div>

        {/* ─── SCAN RESULT CARD ─── */}
        {currentResult && (
          <section style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', margin: '30px 0', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#0f766e', margin: '0 0 5px 0' }}>{currentResult.name}</h3>
            <p style={{ fontSize: '12px', color: '#888', margin: '0 0 15px 0' }}>Scanned on: {currentResult.date}</p>
            
            {/* Nutrition Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px' }}><b style={{ fontSize: '18px', color: '#16a34a' }}>{currentResult.calories}</b><br/><span style={{ fontSize: '11px', color: '#666' }}>Calories</span></div>
              <div style={{ background: '#f0fdfa', padding: '10px', borderRadius: '8px' }}><b style={{ fontSize: '18px', color: '#0d9488' }}>{currentResult.protein}</b><br/><span style={{ fontSize: '11px', color: '#666' }}>Protein</span></div>
              <div style={{ background: '#fff7ed', padding: '10px', borderRadius: '8px' }}><b style={{ fontSize: '18px', color: '#ea580c' }}>{currentResult.carbs}</b><br/><span style={{ fontSize: '11px', color: '#666' }}>Carbs</span></div>
              <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '8px' }}><b style={{ fontSize: '18px', color: '#dc2626' }}>{currentResult.fat}</b><br/><span style={{ fontSize: '11px', color: '#666' }}>Fat</span></div>
            </div>

            <p style={{ fontSize: '13px', color: '#444', margin: '0 0 15px 0' }}><b>Minerals & Micronutrients:</b> {currentResult.minerals}</p>
            
            {/* Health Guidance Text for AdSense Bot Content Requirement */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#333', margin: '0 0 5px 0' }}>Health & Nutrition Guidance:</h4>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.5', margin: 0 }}>{currentResult.description}</p>
            </div>
          </section>
        )}

        {/* ─── ADSENSE PLACEHOLDER 2 (Mid Inline Rectangle) ─── */}
        <div style={{ width: '100%', height: '250px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px', borderRadius: '8px', margin: '20px 0', border: '1px dashed #cbd5e1' }}>
          [ AdSense Advertisement - Inline Rectangle ]
        </div>

        {/* ─── SAVED MEALS / HISTORY SECTION ─── */}
        <section style={{ margin: '40px 0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: '#333', margin: '0 0 15px 0' }}>📋 Your Recent Scans (Saved Locally)</h3>
          {scanHistory.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#888', fontStyle: 'italic', margin: 0 }}>No recent meals scanned yet. Scanned items save here automatically.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {scanHistory.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setCurrentResult(item)} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.2s' }}
                >
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>{item.name}</h4>
                    <span style={{ fontSize: '11px', color: '#999' }}>{item.date}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: '#0d9488', fontSize: '14px' }}>{item.calories} kcal</span>
                    <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>P: {item.protein} | C: {item.carbs} | F: {item.fat}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ─── FOOTER SECTION (Crucial for AdSense) ─── */}
      <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#fff', padding: '30px 20px', marginTop: '60px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>&copy; {new Date().getFullYear()} Givo AI Nutrition. All rights reserved.</p>
          
          {/* AdSense Mandatory Legal Links */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/privacy-policy" style={{ fontSize: '13px', color: '#0d9488', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
            <a href="/terms" style={{ fontSize: '13px', color: '#0d9488', textDecoration: 'none', fontWeight: '500' }}>Terms of Service</a>
            <a href="/about" style={{ fontSize: '13px', color: '#0d9488', textDecoration: 'none', fontWeight: '500' }}>About Us</a>
            <a href="/contact" style={{ fontSize: '13px', color: '#0d9488', textDecoration: 'none', fontWeight: '500' }}>Contact Us</a>
          </div>
          <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', maxWidth: '500px', margin: 0, lineHeight: '1.4' }}>
            Disclaimer: Givo provides AI-generated nutritional estimations based on visual data. This tool does not replace professional medical or dietary advice.
          </p>
        </div>
      </footer>

    </div>
  );
}
