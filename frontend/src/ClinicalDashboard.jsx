// This file is not neccessary
import { useState, useEffect, useRef } from "react";



export default function ClinicalDashboard() {
  const [alignmentAccuracy, setAlignmentAccuracy] = useState(94.7);
  const [tipDepth, setTipDepth] = useState(8.4);
  const [confidence, setConfidence] = useState(0.92);
  const [logEntries, setLogEntries] = useState([
    { time: "14:22:11", message: "Needle aligned • 15° insertion", accuracy: 96 },
    { time: "14:21:58", message: "Successful subcutaneous delivery", accuracy: 93 },
    { time: "14:21:45", message: "Needle aligned • 18° insertion", accuracy: 98 },
  ]);
  const [isStreaming, setIsStreaming] = useState(true);
  const videoRef = useRef(null);

  // Live simulation (updates every 1.2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setAlignmentAccuracy((prev) => Math.max(88, Math.min(99.9, prev + (Math.random() * 4 - 2))));
      setTipDepth((prev) => Math.max(5.2, Math.min(12.8, prev + (Math.random() * 1.2 - 0.6))));
      setConfidence((prev) => Math.max(0.85, Math.min(0.98, prev + (Math.random() * 0.08 - 0.04))));

      if (Math.random() > 0.82) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setLogEntries((prev) => {
          const newEntry = {
            time: timeStr,
            message: "Needle aligned • Successful insertion",
            accuracy: Math.round(alignmentAccuracy),
          };
          return [newEntry, ...prev.slice(0, 4)];
        });
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [alignmentAccuracy]);

  // Fake video (replace with your real YOLO stream later)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny_320x180_10s_1MB.mp4";
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        .live-dot { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
      `}</style>

      {/* HEADER */}
      <div style={s.header}>
        <div style={s.logo}>
          <div style={s.logoIcon}>CDI</div>
          <div>
            <div style={s.title}>Clinical Diagnostic Intelligence</div>
            <div style={s.subtitle}>YOLOv11 • Real-time Injection Monitoring</div>
          </div>
        </div>

        <div style={s.statusBar}>
          <div style={s.gpuBadge}>
            <span style={s.liveDot} /> GPU: RTX 5070 ACTIVE
          </div>
          <div style={s.modelBadge}>Model: Llama 3.2 Vision</div>
          <div style={s.streamBadge}>
            <span style={s.liveDot} /> LIVE YOLOv11 STREAM
          </div>
        </div>
      </div>

      <div style={s.mainContent}>
        {/* LEFT: 16:9 LIVE VIEWPORT */}
        <div style={s.viewportContainer}>
          <div style={s.viewport}>
            <video ref={videoRef} style={s.video} playsInline muted />

            {/* YOLO Overlay */}
            {isStreaming && (
              <>
                {/* Bounding box */}
                <div style={s.boundingBox}>
                  <div style={s.needleLabel}>NEEDLE TIP</div>
                  <div style={s.angleBadge}>15.2°</div>
                </div>

                {/* Confidence */}
                <div style={s.confidenceBadge}>
                  Confidence • <span style={{ fontSize: 22 }}>{Math.round(confidence * 100)}%</span>
                </div>

                {/* LIVE indicator */}
                <div style={s.liveIndicator}>LIVE</div>
              </>
            )}

            {!isStreaming && (
              <div style={s.noStream}>
                <div style={{ fontSize: 80, marginBottom: 16 }}>📡</div>
                <div style={{ fontSize: 24, marginBottom: 20 }}>Waiting for YOLOv11 stream...</div>
                <button onClick={() => setIsStreaming(true)} style={s.startBtn}>
                  ▶ START MONITORING
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: METRICS SIDEBAR */}
        <div style={s.sidebar}>
          <div style={s.metricCard}>
            <div style={s.metricTitle}>Needle Alignment Accuracy</div>
            <div style={s.metricValue}>{alignmentAccuracy.toFixed(1)}%</div>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: `${alignmentAccuracy}%` }} />
            </div>
          </div>

          <div style={s.metricCard}>
            <div style={s.metricTitle}>Tip Depth</div>
            <div style={s.metricValue}>{tipDepth.toFixed(1)} <span style={s.unit}>mm</span></div>
          </div>

          <div style={s.metricCard}>
            <div style={s.metricTitle}>Detection Confidence</div>
            <div style={s.metricValue}>{Math.round(confidence * 100)}%</div>
          </div>

          <button onClick={() => setIsStreaming(!isStreaming)} style={s.toggleBtn}>
            {isStreaming ? "⏹ STOP STREAM" : "▶ START STREAM"}
          </button>
        </div>
      </div>

      {/* BOTTOM LOG */}
      <div style={s.logPanel}>
        <div style={s.logHeader}>Successful Alignment Log</div>
        <div style={s.logContainer}>
          {logEntries.map((entry, i) => (
            <div key={i} style={s.logRow}>
              <div style={s.logTime}>{entry.time}</div>
              <div style={s.logMessage}>{entry.message}</div>
              <div style={s.logAccuracy}>{entry.accuracy}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Styles (exactly like your original Dashboard) ─────────────────────
const s = {
  root: { display: "flex", flexDirection: "column", height: "100vh", background: "linear-gradient(180deg, #0a0a0a 0%, #111113 100%)", color: "#fff", fontFamily: "'Inter', sans-serif", overflow: "hidden" },
  header: { height: 64, background: "#111113", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", padding: "0 32px", gap: 24 },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 40, height: 40, background: "#10b981", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20 },
  title: { fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", fontFamily: "'Space Grotesk', sans-serif" },
  subtitle: { fontSize: 12, color: "#10b981", marginTop: -2 },
  statusBar: { display: "flex", gap: 16, marginLeft: "auto", alignItems: "center" },
  gpuBadge: { background: "#052e16", color: "#10b981", padding: "6px 16px", borderRadius: 999, fontSize: 13, display: "flex", alignItems: "center", gap: 6 },
  modelBadge: { background: "#052e16", color: "#10b981", padding: "6px 16px", borderRadius: 999, fontSize: 13 },
  streamBadge: { background: "#052e16", color: "#10b981", padding: "6px 16px", borderRadius: 999, fontSize: 13, display: "flex", alignItems: "center", gap: 6 },
  liveDot: { width: 8, height: 8, background: "#10b981", borderRadius: "50%", animation: "pulse 2s infinite" },
  mainContent: { flex: 1, display: "flex", padding: 24, gap: 24, overflow: "hidden" },
  viewportContainer: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#000", borderRadius: 24, padding: 12, boxShadow: "0 0 40px -10px rgb(16 185 129)" },
  viewport: { width: "100%", maxWidth: 1280, aspectRatio: "16/9", background: "#111", borderRadius: 20, position: "relative", overflow: "hidden" },
  video: { width: "100%", height: "100%", objectFit: "cover" },
  boundingBox: { position: "absolute", top: "38%", left: "42%", width: "18%", height: "42%", border: "3px solid #10b981", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  needleLabel: { position: "absolute", top: -28, background: "#10b981", color: "#000", fontSize: 11, fontWeight: 700, padding: "2px 12px", borderRadius: 999, whiteSpace: "nowrap" },
  angleBadge: { position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.7)", color: "#10b981", fontSize: 13, padding: "2px 10px", borderRadius: 6, fontFamily: "monospace" },
  confidenceBadge: { position: "absolute", top: 24, right: 24, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "10px 20px", borderRadius: 999, fontSize: 15, display: "flex", alignItems: "center", gap: 8, border: "1px solid #10b981" },
  liveIndicator: { position: "absolute", top: 24, left: 24, background: "#ef4444", color: "#fff", padding: "4px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: 1 },
  noStream: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", color: "#fff" },
  startBtn: { background: "#10b981", color: "#000", border: "none", padding: "16px 32px", fontSize: 16, fontWeight: 700, borderRadius: 999, cursor: "pointer" },
  sidebar: { width: 320, background: "#111113", borderRadius: 24, padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  metricCard: { background: "#1a1a1e", padding: 20, borderRadius: 20 },
  metricTitle: { fontSize: 13, color: "#10b981", marginBottom: 8 },
  metricValue: { fontSize: 42, fontWeight: 700, fontFamily: "monospace" },
  unit: { fontSize: 18, fontWeight: 400, color: "#666" },
  progressBar: { height: 8, background: "#222", borderRadius: 999, marginTop: 12, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #10b981, #34d399)", transition: "width 0.7s ease" },
  toggleBtn: { marginTop: "auto", background: "#10b981", color: "#000", border: "none", height: 56, borderRadius: 999, fontWeight: 700, fontSize: 15, cursor: "pointer" },
  logPanel: { height: 260, background: "#111113", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px 24px", display: "flex", flexDirection: "column" },
  logHeader: { color: "#10b981", fontSize: 13, fontWeight: 600, marginBottom: 12, letterSpacing: 0.5 },
  logContainer: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 },
  logRow: { display: "flex", alignItems: "center", background: "#1a1a1e", padding: "12px 20px", borderRadius: 16, fontSize: 14 },
  logTime: { width: 80, fontFamily: "monospace", color: "#10b981" },
  logMessage: { flex: 1 },
  logAccuracy: { fontFamily: "monospace", color: "#10b981", fontSize: 18, fontWeight: 700 },
};