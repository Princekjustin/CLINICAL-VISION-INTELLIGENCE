// ─────────────────────────────────────────────────────────────────────────────
// healthcare-components.jsx
// A collection of missing healthcare-grade UI components
// Import individually as needed
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ══════════════════════════════════════════════════════════════════════════
// 1. CLINICAL CONSENT BANNER
// Shows once on first login — HIPAA/clinical AI disclaimer
// Usage: <ConsentBanner onAccept={() => {}} />
// ══════════════════════════════════════════════════════════════════════════
export function ConsentBanner({ onAccept }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cvi_consent_v1");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cvi_consent_v1", new Date().toISOString());
    setVisible(false);
    if (onAccept) onAccept();
  };

  if (!visible) return null;

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(6px)",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;600;700&display=swap');`}</style>
      <div style={{
        background:"#fff", borderRadius:20, padding:"40px 44px",
        maxWidth:560, width:"90%", boxShadow:"0 24px 64px rgba(0,0,0,0.3)",
        borderTop:"4px solid #00c9b5",
      }}>
        <div style={{ fontSize:28, marginBottom:12 }}>🏥</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:"#0d1b2a", marginBottom:8 }}>
          Clinical AI Disclaimer
        </div>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"#4a5568", lineHeight:1.8, marginBottom:20 }}>
          <strong>Clinical Vision Intelligence</strong> is an AI-assisted tool for
          educational and research purposes. It is <strong>not a certified medical device</strong> and
          must not be used as the sole basis for clinical decisions.
          <br/><br/>
          All detections are advisory only. A qualified healthcare professional must
          review and approve any clinical action. By continuing, you confirm you
          understand this system's limitations.
        </div>
        {[
          "I understand this is an AI-assisted research prototype",
          "I will not use this as the sole basis for clinical decisions",
          "All sessions are logged for audit and review purposes",
        ].map((item, i) => (
          <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}>
            <span style={{ color:"#00c9b5", fontWeight:700, flexShrink:0 }}>✓</span>
            <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"#718096" }}>{item}</span>
          </div>
        ))}
        <button onClick={accept} style={{
          width:"100%", marginTop:20,
          background:"linear-gradient(135deg,#00c9b5,#006d7e)",
          color:"#fff", border:"none", borderRadius:12,
          fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700,
          padding:"13px", cursor:"pointer",
        }}>
          I Understand — Continue to System
        </button>
        <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, color:"#a0aec0", textAlign:"center", marginTop:12 }}>
          This acknowledgement is recorded with timestamp for compliance purposes.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 2. SESSION TIMEOUT WARNING
// Warns user 2 minutes before 30-minute inactivity logout
// Usage: <SessionTimeout onLogout={handleLogout} timeoutMinutes={30} />
// ══════════════════════════════════════════════════════════════════════════
export function SessionTimeout({ onLogout, timeoutMinutes = 30 }) {
  const [warning, setWarning]   = useState(false);
  const [countdown, setCountdown] = useState(120);
  const TIMEOUT_MS  = timeoutMinutes * 60 * 1000;
  const WARNING_MS  = TIMEOUT_MS - 2 * 60 * 1000; // warn 2 mins before

  const reset = useCallback(() => {
    setWarning(false);
    setCountdown(120);
    localStorage.setItem("cvi_last_active", Date.now().toString());
  }, []);

  useEffect(() => {
    localStorage.setItem("cvi_last_active", Date.now().toString());
    const events = ["mousedown","keydown","touchstart","scroll"];
    events.forEach(e => window.addEventListener(e, reset));

    const checker = setInterval(() => {
      const last   = parseInt(localStorage.getItem("cvi_last_active") || "0");
      const idle   = Date.now() - last;
      if (idle >= TIMEOUT_MS) {
        onLogout?.();
      } else if (idle >= WARNING_MS) {
        setWarning(true);
        setCountdown(Math.ceil((TIMEOUT_MS - idle) / 1000));
      }
    }, 5000);

    return () => {
      events.forEach(e => window.removeEventListener(e, reset));
      clearInterval(checker);
    };
  }, [TIMEOUT_MS, WARNING_MS, onLogout, reset]);

  if (!warning) return null;

  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:8888,
      background:"#fff", borderRadius:16, padding:"20px 24px",
      boxShadow:"0 8px 32px rgba(0,0,0,0.18)",
      border:"2px solid #f59e0b", maxWidth:320,
      animation:"fadeIn 0.3s ease",
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <span style={{ fontSize:20 }}>⏱</span>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#0d1b2a" }}>
          Session Expiring
        </div>
      </div>
      <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"#718096", marginBottom:14 }}>
        Your session will expire in <strong style={{ color:"#f59e0b" }}>{countdown}s</strong> due to inactivity.
        All unsaved session data will be preserved in localStorage.
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={reset} style={{
          flex:1, background:"linear-gradient(135deg,#00c9b5,#006d7e)",
          color:"#fff", border:"none", borderRadius:10,
          fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700,
          padding:"9px", cursor:"pointer",
        }}>Stay Logged In</button>
        <button onClick={onLogout} style={{
          flex:1, background:"#fde8e8", color:"#c62828",
          border:"1px solid #ef9a9a", borderRadius:10,
          fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700,
          padding:"9px", cursor:"pointer",
        }}>Logout</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 3. PRIVACY NOTICE FOOTER BAR
// Persistent small bar shown on all pages — GDPR/clinical data notice
// Usage: <PrivacyBar />
// ══════════════════════════════════════════════════════════════════════════
export function PrivacyBar() {
  const [dismissed, setDismissed] = useState(
    () => !!localStorage.getItem("cvi_privacy_bar_dismissed")
  );

  if (dismissed) return null;

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:7777,
      background:"rgba(13,27,42,0.97)",
      backdropFilter:"blur(12px)",
      borderTop:"1px solid rgba(0,201,181,0.3)",
      padding:"12px 24px",
      display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
    }}>
      <span style={{ fontSize:16 }}>🔒</span>
      <div style={{ flex:1, fontFamily:"'Nunito',sans-serif", fontSize:11, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>
        <strong style={{ color:"rgba(255,255,255,0.9)" }}>Data Notice:</strong> This system processes medical images locally.
        No patient data is transmitted to external servers. Session data is stored only in your browser's localStorage
        and is cleared on logout. This system is for research and educational use only.
      </div>
      <button onClick={() => {
        localStorage.setItem("cvi_privacy_bar_dismissed", "1");
        setDismissed(true);
      }} style={{
        background:"rgba(0,201,181,0.15)", border:"1px solid rgba(0,201,181,0.4)",
        color:"#00c9b5", borderRadius:8, padding:"6px 14px",
        fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:700, cursor:"pointer",
        flexShrink:0,
      }}>
        Understood ×
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 4. NETWORK STATUS INDICATOR
// Shows when backend API is unreachable
// Usage: <NetworkStatus apiUrl="http://localhost:8000" />
// ══════════════════════════════════════════════════════════════════════════
export function NetworkStatus({ apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000" }) {
  const [status, setStatus] = useState("checking"); // checking | online | offline

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${apiUrl}/health`, { signal: AbortSignal.timeout(3000) });
        setStatus(res.ok ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    };
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, [apiUrl]);

  if (status === "online" || status === "checking") return null;

  return (
    <div style={{
      position:"fixed", top:70, left:"50%", transform:"translateX(-50%)",
      zIndex:8888, background:"#fde8e8", border:"1.5px solid #ef9a9a",
      borderRadius:12, padding:"10px 20px",
      display:"flex", alignItems:"center", gap:10,
      boxShadow:"0 4px 20px rgba(0,0,0,0.12)",
      animation:"fadeIn 0.3s ease",
    }}>
      <span>🔴</span>
      <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700, color:"#c62828" }}>
        Backend offline — Start: <code style={{ fontSize:10 }}>uvicorn main:app --port 8000</code>
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 5. 404 NOT FOUND PAGE
// Usage: <Route path="*" element={<NotFoundPage />} />
// ══════════════════════════════════════════════════════════════════════════
export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#006d7e,#00c9b5)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Nunito',sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;600;700&display=swap');`}</style>
      <div style={{ textAlign:"center", color:"#fff" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:100, fontWeight:800, color:"rgba(255,255,255,0.15)", lineHeight:1 }}>404</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, marginBottom:12, marginTop:-20 }}>Page Not Found</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", marginBottom:28, maxWidth:360 }}>
          The clinical module you requested doesn't exist or has been moved.
        </div>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={() => navigate("/")} style={{
            background:"#fff", color:"#006d7e", border:"none", borderRadius:12,
            fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, padding:"12px 28px", cursor:"pointer",
          }}>← Back to Home</button>
          <button onClick={() => navigate("/dashboard")} style={{
            background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,0.5)",
            borderRadius:12, fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700,
            padding:"12px 28px", cursor:"pointer",
          }}>Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// 6. SKELETON LOADER — shows while detection is running
// Usage: <SkeletonCard lines={3} />
// ══════════════════════════════════════════════════════════════════════════
export function SkeletonCard({ height = 200 }) {
  return (
    <div style={{
      background:"#fff", borderRadius:16, padding:20,
      boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
      border:"1px solid #f0f4f8",
    }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0 }
          100% { background-position: 400px 0 }
        }
        .skeleton-line {
          background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease infinite;
          border-radius: 6px;
        }
      `}</style>
      <div className="skeleton-line" style={{ height:14, width:"40%", marginBottom:16 }}/>
      <div className="skeleton-line" style={{ height, width:"100%", marginBottom:12 }}/>
      <div className="skeleton-line" style={{ height:10, width:"60%", marginBottom:8 }}/>
      <div className="skeleton-line" style={{ height:10, width:"45%" }}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// HOW TO USE THESE COMPONENTS
// ══════════════════════════════════════════════════════════════════════════
//
// In Dashboard.jsx — add to the main export:
//
//   import { ConsentBanner, SessionTimeout, PrivacyBar, NetworkStatus } from "./healthcare-components";
//
//   export default function Dashboard({ user, onLogout }) {
//     return (
//       <div style={s.root}>
//         <ConsentBanner />
//         <SessionTimeout onLogout={onLogout} timeoutMinutes={30} />
//         <PrivacyBar />
//         <NetworkStatus apiUrl="http://localhost:8000" />
//         <Sidebar user={user} onLogout={onLogout} />
//         <main style={s.main}>...</main>
//       </div>
//     );
//   }
//
// In App.jsx — update the catch-all route:
//   import { NotFoundPage } from "./healthcare-components";
//   <Route path="*" element={<NotFoundPage />} />
//
// In Upload/Camera pages — replace loading spinner with SkeletonCard:
//   import { SkeletonCard } from "./healthcare-components";
//   {loading && <SkeletonCard height={240} />}
