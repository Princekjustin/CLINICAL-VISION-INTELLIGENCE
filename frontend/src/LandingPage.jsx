import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [tick, setTick]     = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000);
    setTimeout(() => setVisible(true), 100);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Nunito:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #006d7e; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes float2   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes pulse    { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
        @keyframes ecg      { from{stroke-dashoffset:1200} to{stroke-dashoffset:0} }
        @keyframes scanline { 0%{top:-4%} 100%{top:104%} }
        @keyframes glow     { 0%,100%{box-shadow:0 0 18px rgba(0,201,181,0.4)} 50%{box-shadow:0 0 36px rgba(0,201,181,0.8)} }
        @keyframes rotate   { to{transform:rotate(360deg)} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }

        .cta-btn {
          background: #fff;
          color: #006d7e;
          border: none;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          padding: 16px 44px;
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 6px 28px rgba(0,0,0,0.18);
          letter-spacing: 0.02em;
        }
        .cta-btn:hover { background: #e0f7f5; transform: translateY(-2px); box-shadow: 0 10px 36px rgba(0,0,0,0.22); }

        .outline-btn {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 14px 36px;
          cursor: pointer;
          transition: all 0.22s;
          letter-spacing: 0.02em;
        }
        .outline-btn:hover { border-color: #fff; background: rgba(255,255,255,0.08); }

        .feat-card {
          transition: transform 0.22s, box-shadow 0.22s;
          cursor: default;
        }
        .feat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.22) !important; }

        .stat-card {
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: scale(1.04); }

        .nav-link {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #fff; }

        .ecg-path { stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: ecg 4s ease forwards 0.5s; }
      `}</style>

      {/* Animated background blobs */}
      <div style={S.blob1} />
      <div style={S.blob2} />
      <div style={S.blob3} />
      <div style={S.blob4} />

      {/* Scanline effect */}
      <div style={S.scanline} />

      {/* Floating medical icons */}
      <div style={{ ...S.floatIcon, top: "14%", left: "5%", animation: "float 5s ease-in-out infinite" }}>
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M3 3c0 0 3 2 3 5s-3 5-3 5M21 3c0 0-3 2-3 5s3 5 3 5M3 13c0 0 3 2 3 5s-3 5-3 5M21 13c0 0-3 2-3 5s3 5 3 5"/>
          <line x1="6" y1="5" x2="18" y2="5"/><line x1="6" y1="8" x2="18" y2="8"/>
          <line x1="6" y1="15" x2="18" y2="15"/><line x1="6" y1="18" x2="18" y2="18"/>
        </svg>
      </div>
      <div style={{ ...S.floatIcon, top: "20%", right: "4%", animation: "float2 4s ease-in-out infinite 0.8s" }}>
        <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M18 2l4 4-14 14H4v-4L18 2z"/><line x1="9" y1="11" x2="13" y2="7"/>
          <line x1="11" y1="13" x2="15" y2="9"/><line x1="2" y1="22" x2="6" y2="18"/>
        </svg>
      </div>
      <div style={{ ...S.floatIcon, bottom: "28%", left: "4%", animation: "float 6s ease-in-out infinite 1.2s" }}>
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <div style={{ ...S.floatIcon, bottom: "24%", right: "5%", animation: "float2 5s ease-in-out infinite 0.4s" }}>
        <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>

      {/* ECG Line */}
      <div style={S.ecgWrap}>
        <svg viewBox="0 0 1000 70" style={{ width: "100%", height: 70 }}>
          <path className="ecg-path"
            d="M0,35 L80,35 L110,35 L128,5 L146,65 L164,5 L182,35 L230,35 L248,5 L266,65 L284,5 L302,35 L380,35 L398,5 L416,65 L434,5 L452,35 L520,35 L538,5 L556,65 L574,5 L592,35 L670,35 L688,5 L706,65 L724,5 L742,35 L840,35 L858,5 L876,65 L894,5 L912,35 L1000,35"
            fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── NAVBAR ── */}
      <nav style={S.nav}>
        <div style={S.navLogo}>
          <div style={S.navCross}>
            <div style={S.crossV}/><div style={S.crossH}/>
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>
            Clinical Vision Intelligence
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span className="nav-link" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Overview</span>
          <span className="nav-link" onClick={() => document.getElementById("features-section")?.scrollIntoView({behavior:"smooth"})}>Features</span>
          <span className="nav-link" onClick={() => document.getElementById("cta-section")?.scrollIntoView({behavior:"smooth"})}>Technology</span>
          <button className="outline-btn" style={{ padding: "8px 22px", fontSize: 13 }} onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        ...S.hero,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease"
      }}>
        {/* Status badge */}
        <div style={S.heroBadge}>
          <span style={S.badgeDot} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em" }}>
            SYSTEM ONLINE · YOLOV11 READY · MONAI ACTIVE
          </span>
        </div>

        {/* Hero headline */}
        <h1 style={S.heroH1}>
          Real-Time Needle<br />
          <span style={{ color: "#00e5d0" }}>Angle Monitoring</span>
        </h1>

        <p style={S.heroSub}>
          The first AI-powered clinical system that detects needle insertion angles in real time —
          protecting patients from injection errors using YOLOv11 and MONAI medical imaging.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <button className="cta-btn" onClick={() => navigate("/login")}>
            Access System →
          </button>
          <button className="outline-btn" onClick={() => navigate("/register")}>
            Create Account
          </button>
          <button className="outline-btn" onClick={() => setShowDocs(true)}
            style={{ padding:"14px 28px", fontSize:14, borderColor:"rgba(255,255,255,0.3)" }}>
            📋 View Documentation
          </button>
        </div>

        {/* Hero glassmorphism card */}
        <div style={S.heroCard}>
          {/* Mock detection display */}
          <div style={S.cardInner}>
            {/* Left — camera feed mock */}
            <div style={S.mockFeed}>
              <div style={S.feedHeader}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#00e5d0", letterSpacing: "0.15em" }}>
                  ● LIVE FEED
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
                  {tick.toLocaleTimeString("en-GB", { hour12: false })}
                </span>
              </div>
              <div style={S.feedBody}>
                {/* Simulated bounding box */}
                <div style={S.bbox}>
                  <div style={S.bboxCornerTL}/><div style={S.bboxCornerTR}/>
                  <div style={S.bboxCornerBL}/><div style={S.bboxCornerBR}/>
                  <div style={S.bboxLabel}>22° · 0.87</div>
                </div>
                {/* Grid lines */}
                {[...Array(4)].map((_,i) => (
                  <div key={i} style={{ position:"absolute", left:0, right:0, top:`${25*(i+1)}%`, height:1, background:"rgba(0,229,208,0.08)" }}/>
                ))}
                {[...Array(4)].map((_,i) => (
                  <div key={i} style={{ position:"absolute", top:0, bottom:0, left:`${25*(i+1)}%`, width:1, background:"rgba(0,229,208,0.08)" }}/>
                ))}
                <div style={S.feedPlaceholder}>Injection Monitoring Active</div>
              </div>
            </div>

            {/* Right — stats panel */}
            <div style={S.statsPanel}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", marginBottom: 14 }}>
                DETECTION STATUS
              </div>

              {/* Status indicator */}
              <div style={S.statusPill}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5d0", animation: "pulse 1.5s ease infinite" }}/>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#00e5d0" }}>
                  System Active: Needle Tracking
                </span>
              </div>

              {/* Angle readout */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>DETECTED ANGLE</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  22°
                </div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 11, color: "#00e5d0", marginTop: 4 }}>
                  Within safe range (15–30°)
                </div>
              </div>

              {/* Confidence */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>CONFIDENCE</span>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "#00e5d0", fontWeight: 700 }}>87%</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 5, overflow: "hidden" }}>
                  <div style={{ width: "87%", height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #00c9b5, #00e5d0)" }}/>
                </div>
              </div>

              {/* Alert */}
              <div style={S.alertNormal}>
                ✅ &nbsp; NORMAL — No intervention required
              </div>

              {/* Model info */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: 10 }}>
                {[["MODEL","YOLOv11n"],["PIPELINE","MONAI"],["CLASSES","18 angles"]].map(([k,v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{k}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={S.statsRow}>
        {[
          { val: "16,368", lbl: "Training Images", icon: "📦" },
          { val: "18",     lbl: "Angle Classes",   icon: "📐" },
          { val: "RTX 5070", lbl: "GPU Trained",   icon: "⚡" },
          { val: "800ms",  lbl: "Frame Rate",      icon: "🎯" },
        ].map(({ val, lbl, icon }) => (
          <div key={lbl} className="stat-card" style={S.statCard}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff" }}>{val}</div>
            <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{lbl}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section id="features-section" style={S.features}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", marginBottom: 10 }}>
            WHAT IT DOES
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, color: "#fff" }}>
            Built for Clinical Precision
          </h2>
        </div>

        <div style={S.featureGrid}>
          {[
            { icon:"🧠", title:"YOLOv11 Detection",      body:"Detects needle insertion angle in real time across 18 discrete classes from 15° to 30°, plus critical out-of-range alerts.", color:"#00c9b5" },
            { icon:"🔬", title:"MONAI Preprocessing",     body:"Clinical-grade image normalisation using ScaleIntensity and NormalizeIntensity — ensures consistent results under any hospital lighting.", color:"#7c3aed" },
            { icon:"🚨", title:"3-Tier Alert System",     body:"Critical (above 30°), Warning (below 15°), Normal — intelligent alerts with configurable confidence threshold to prevent alarm fatigue.", color:"#e53935" },
            { icon:"📋", title:"Session Audit Log",       body:"Every detection logged with timestamp, angle class, confidence score and alert level. Export as CSV for clinical documentation.", color:"#f59e0b" },
            { icon:"📷", title:"Live Camera Monitoring",  body:"WebRTC webcam feed with frame capture every 800ms. Real-time bounding box overlay shows exactly what the AI is detecting.", color:"#00c9b5" },
            { icon:"🔒", title:"Human-in-the-Loop",       body:"The AI informs — the clinician decides. Confidence scores are always shown. No automated clinical action is ever taken without human review.", color:"#1e8449" },
          ].map(({ icon, title, body, color }) => (
            <div key={title} className="feat-card" style={{ ...S.featCard, borderTop: `3px solid ${color}` }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="cta-section" style={S.finalCta}>
        <div style={S.ctaCard}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", marginBottom: 12 }}>
            GET STARTED
          </div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            Ready to monitor?
          </h2>
          <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 28, maxWidth: 400 }}>
            Create your clinical account and start monitoring injection angles in real time.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="cta-btn" onClick={() => navigate("/register")}>Create Account →</button>
            <button className="outline-btn" onClick={() => navigate("/login")}>Sign In</button>
            <button className="outline-btn" onClick={() => setShowDocs(true)} style={{ borderColor:"rgba(255,255,255,0.3)", fontSize:14 }}>📋 Docs</button>
          </div>
        </div>
      </section>

      {/* ── DOCUMENTATION MODAL ── */}
      {showDocs && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)" }}
          onClick={() => setShowDocs(false)}>
          <div style={{ background:"#0a1628", border:"1.5px solid rgba(0,201,181,0.35)", borderRadius:20, padding:"36px 40px", maxWidth:640, width:"90%", maxHeight:"80vh", overflowY:"auto", position:"relative" }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowDocs(false)} style={{ position:"absolute", top:16, right:20, background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:22, cursor:"pointer" }}>×</button>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff", marginBottom:6 }}>Technical Documentation</div>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"#00c9b5", letterSpacing:"0.12em", marginBottom:24 }}>CLINICAL VISION INTELLIGENCE — ARCHITECTURE SPECS</div>

            {[
              { title:"System Architecture", body:"React frontend (localhost:3000) ↔ FastAPI backend (localhost:8000) ↔ YOLOv11 model inference + MONAI preprocessing pipeline." },
              { title:"Data Flow (DFD)", body:"Input (Camera/Upload) → MONAI ScaleIntensity + NormalizeIntensity → YOLOv11n inference → Angle classification (18 classes) → 3-tier alert engine → React dashboard → localStorage audit log." },
              { title:"Model Specifications", body:"Architecture: YOLOv11n  ·  Dataset: 16,368 images (Roboflow)  ·  Classes: 18 needle angle classes (15°–30°, Below 15°, Above 30°)  ·  Training: 50 epochs  ·  Hardware: NVIDIA RTX 5070  ·  Format: YOLOv11 640×640" },
              { title:"Alert Logic", body:"Critical: Above 30° (needle too steep — injury risk)  ·  Warning: Below 15° (too shallow — drug misses target tissue)  ·  Normal: 15–30° range  ·  Threshold: 40% confidence minimum" },
              { title:"API Endpoints", body:"POST /detect — image inference  ·  GET /log — session audit log  ·  DELETE /log — clear log  ·  GET /health — system status  ·  GET /categories — class definitions" },
              { title:"Running the System", body:"Terminal 1: cd D:\Project\backend && uvicorn main:app --reload --port 8000  ·  Terminal 2: cd D:\Project\frontend && npm start  ·  Browser: localhost:3000" },
            ].map(({ title, body }) => (
              <div key={title} style={{ borderLeft:"3px solid #00c9b5", paddingLeft:16, marginBottom:20 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"#00c9b5", marginBottom:6 }}>{title}</div>
                <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.navCross}><div style={S.crossV}/><div style={S.crossH}/></div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
            Clinical Vision Intelligence
          </span>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
          YOLOv11 · MONAI · FastAPI · React · RTX 5070 · 2026
        </div>
      </footer>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const S = {
  root: {
    position: "relative",
    minHeight: "100vh",
    background: "linear-gradient(160deg, #006d7e 0%, #00a3b5 45%, #00c9b5 100%)",
    overflow: "hidden",
    fontFamily: "'Nunito', sans-serif",
  },
  blob1: { position:"absolute", top:"-12%", left:"-8%", width:500, height:500, borderRadius:"50%", background:"rgba(255,255,255,0.07)", filter:"blur(2px)", pointerEvents:"none" },
  blob2: { position:"absolute", bottom:"-15%", right:"-6%", width:580, height:580, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" },
  blob3: { position:"absolute", top:"40%", left:"30%", width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" },
  blob4: { position:"absolute", top:"20%", right:"20%", width:160, height:160, borderRadius:"50%", background:"rgba(0,229,208,0.08)", pointerEvents:"none" },
  floatIcon: { position:"absolute", zIndex:1, pointerEvents:"none" },
  scanline: {
    position:"fixed", left:0, right:0, height:3,
    background:"rgba(0,229,208,0.06)", filter:"blur(1px)",
    animation:"scanline 8s linear infinite", zIndex:2, pointerEvents:"none"
  },
  ecgWrap: { position:"fixed", bottom:0, left:0, right:0, opacity:0.5, zIndex:1, pointerEvents:"none" },

  // Navbar
  nav: {
    position:"sticky", top:0, zIndex:100,
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"14px 48px",
    background:"rgba(0,80,90,0.55)",
    backdropFilter:"blur(16px)",
    WebkitBackdropFilter:"blur(16px)",
    borderBottom:"1px solid rgba(255,255,255,0.1)",
  },
  navLogo: { display:"flex", alignItems:"center", gap:12 },
  navCross: { position:"relative", width:22, height:22 },
  crossV: { position:"absolute", left:"50%", top:0, bottom:0, width:5, background:"rgba(255,255,255,0.9)", borderRadius:2, transform:"translateX(-50%)" },
  crossH: { position:"absolute", top:"50%", left:0, right:0, height:5, background:"rgba(255,255,255,0.9)", borderRadius:2, transform:"translateY(-50%)" },

  // Hero
  hero: { maxWidth:1100, margin:"0 auto", padding:"80px 32px 40px", textAlign:"center", position:"relative", zIndex:5 },
  heroBadge: {
    display:"inline-flex", alignItems:"center", gap:8,
    background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)",
    border:"1px solid rgba(255,255,255,0.2)", borderRadius:99,
    padding:"6px 18px", marginBottom:28,
  },
  badgeDot: { width:7, height:7, borderRadius:"50%", background:"#00e5d0", boxShadow:"0 0 8px #00e5d0", animation:"pulse 2s ease infinite", display:"inline-block" },
  heroH1: {
    fontFamily:"'Syne',sans-serif", fontSize:"clamp(36px,5.5vw,64px)",
    fontWeight:800, color:"#fff", lineHeight:1.1,
    marginBottom:24, letterSpacing:"-0.02em",
  },
  heroSub: {
    fontFamily:"'Nunito',sans-serif", fontSize:"clamp(14px,1.8vw,18px)",
    color:"rgba(255,255,255,0.75)", maxWidth:620, margin:"0 auto 36px",
    lineHeight:1.7,
  },
  heroCard: {
    background:"rgba(255,255,255,0.10)",
    backdropFilter:"blur(24px)",
    WebkitBackdropFilter:"blur(24px)",
    border:"1.5px solid rgba(255,255,255,0.2)",
    borderRadius:24,
    boxShadow:"0 24px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.25)",
    overflow:"hidden",
    maxWidth:820, margin:"0 auto",
  },
  cardInner: { display:"flex", minHeight:300 },

  // Mock feed
  mockFeed: { flex:1, background:"rgba(0,0,0,0.35)", borderRight:"1px solid rgba(255,255,255,0.08)" },
  feedHeader: { display:"flex", justifyContent:"space-between", padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)" },
  feedBody: { position:"relative", height:250, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" },
  feedPlaceholder: { fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.15)", letterSpacing:"0.1em" },
  bbox: {
    position:"absolute", top:"20%", left:"25%", width:"35%", height:"45%",
    border:"2px solid #00e5d0",
    borderRadius:4,
    boxShadow:"0 0 14px rgba(0,229,208,0.4)",
    animation:"glow 2s ease-in-out infinite",
  },
  bboxCornerTL: { position:"absolute", top:-2, left:-2, width:10, height:10, borderTop:"3px solid #fff", borderLeft:"3px solid #fff" },
  bboxCornerTR: { position:"absolute", top:-2, right:-2, width:10, height:10, borderTop:"3px solid #fff", borderRight:"3px solid #fff" },
  bboxCornerBL: { position:"absolute", bottom:-2, left:-2, width:10, height:10, borderBottom:"3px solid #fff", borderLeft:"3px solid #fff" },
  bboxCornerBR: { position:"absolute", bottom:-2, right:-2, width:10, height:10, borderBottom:"3px solid #fff", borderRight:"3px solid #fff" },
  bboxLabel: {
    position:"absolute", top:-26, left:-2,
    background:"#00e5d0", color:"#003a42",
    fontFamily:"'IBM Plex Mono',monospace", fontSize:9, fontWeight:700,
    padding:"2px 7px", borderRadius:4,
    whiteSpace:"nowrap",
  },

  // Stats panel
  statsPanel: {
    width:220, padding:"18px 16px",
    display:"flex", flexDirection:"column",
    background:"rgba(0,0,0,0.15)",
  },
  statusPill: {
    display:"flex", alignItems:"center", gap:7,
    background:"rgba(0,229,208,0.1)", border:"1px solid rgba(0,229,208,0.3)",
    borderRadius:99, padding:"5px 10px", marginBottom:16,
  },
  alertNormal: {
    background:"rgba(30,132,73,0.18)", border:"1px solid rgba(30,132,73,0.4)",
    borderRadius:8, padding:"7px 10px",
    fontFamily:"'Nunito',sans-serif", fontSize:10, color:"#6fcf97",
    marginBottom:12,
  },

  // Stats row
  statsRow: {
    display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap",
    padding:"32px 32px 0", maxWidth:1100, margin:"0 auto",
    position:"relative", zIndex:5,
  },
  statCard: {
    background:"rgba(255,255,255,0.10)",
    backdropFilter:"blur(12px)",
    border:"1px solid rgba(255,255,255,0.18)",
    borderRadius:16, padding:"20px 32px", textAlign:"center",
    boxShadow:"0 8px 24px rgba(0,0,0,0.1)",
  },

  // Features
  features: { maxWidth:1100, margin:"60px auto 0", padding:"0 32px", position:"relative", zIndex:5 },
  featureGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 },
  featCard: {
    background:"rgba(255,255,255,0.09)",
    backdropFilter:"blur(14px)",
    border:"1px solid rgba(255,255,255,0.14)",
    borderRadius:16, padding:"24px 20px",
    boxShadow:"0 8px 24px rgba(0,0,0,0.1)",
  },

  // Final CTA
  finalCta: { maxWidth:1100, margin:"60px auto 0", padding:"0 32px 60px", textAlign:"center", position:"relative", zIndex:5 },
  ctaCard: {
    background:"rgba(255,255,255,0.09)",
    backdropFilter:"blur(18px)",
    border:"1.5px solid rgba(255,255,255,0.18)",
    borderRadius:24, padding:"52px 40px",
    boxShadow:"0 16px 48px rgba(0,0,0,0.15)",
  },

  // Footer
  footer: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"20px 48px",
    borderTop:"1px solid rgba(255,255,255,0.08)",
    position:"relative", zIndex:5,
  },
};
