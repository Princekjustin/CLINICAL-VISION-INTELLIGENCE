import { useState, useEffect } from "react";

/**
 * SystemStatus
 * Props:
 *   detections — array of detection objects from backend
 *   active     — boolean (is camera/upload running)
 */
export default function SystemStatus({ detections = [], active = false }) {
  const [status, setStatus] = useState("idle");

  // Determine status from bounding box size
  useEffect(() => {
    if (!active || detections.length === 0) {
      setStatus("idle");
      return;
    }

    // Find the largest bounding box in the current detections
    // bbox = [x1, y1, x2, y2]
    const boxAreas = detections.map(d => {
      if (!d.bbox || d.bbox.length < 4) return 0;
      const [x1, y1, x2, y2] = d.bbox;
      return (x2 - x1) * (y2 - y1);
    });

    const maxArea = Math.max(...boxAreas);

    // Threshold: if area > 40000 px² it is a large/imprecise detection
    // Small and precise detections are typically < 20000 px²
    if (maxArea > 40000) {
      setStatus("initializing");
    } else if (maxArea > 0) {
      setStatus("tracking");
    } else {
      setStatus("searching");
    }
  }, [detections, active]);

  const META = {
    idle: {
      label:    "System Standby",
      sub:      "Awaiting input — upload image or start camera",
      dotColor: "#a0aec0",
      glow:     "none",
      pulse:    false,
      border:   "#e2e8f0",
      bg:       "#f7fafc",
      textColor:"#1a202c",
      icon:     "○",
    },
    searching: {
      label:    "Scanning: Locating Injection Site",
      sub:      "No needle angle detected in current frame",
      dotColor: "#f59e0b",
      glow:     "0 0 14px rgba(245,158,11,0.35)",
      pulse:    true,
      border:   "#fde68a",
      bg:       "#fffbeb",
      textColor:"#b45309",
      icon:     "◎",
    },
    initializing: {
      label:    "Initializing: Locating Injection Site",
      sub:      "Large region detected — refining needle position",
      dotColor: "#f59e0b",
      glow:     "0 0 20px rgba(245,158,11,0.45)",
      pulse:    true,
      border:   "#fcd34d",
      bg:       "#fef3c7",
      textColor:"#b45309",
      icon:     "◉",
    },
    tracking: {
      label:    "System Active: Needle Tracking",
      sub:      "Precise detection — angle classification in progress",
      dotColor: "#00c9b5",
      glow:     "0 0 22px rgba(0,201,181,0.5)",
      pulse:    false,
      border:   "#6ee7b7",
      bg:       "#ecfdf5",
      textColor:"#047857",
      icon:     "◈",
    },
  };

  const m = META[status] || META.idle;

  return (
    <div style={{
      ...styles.wrap,
      background: m.bg,
      border: `1.5px solid ${m.border}`,
      boxShadow: m.glow !== "none" ? `${m.glow}, inset 0 1px 0 rgba(255,255,255,0.5)` : "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes sysPulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes sysSpin   { to{transform:rotate(360deg)} }
        @keyframes sysGlowT  { 0%,100%{box-shadow:0 0 14px rgba(0,201,181,0.4)} 50%{box-shadow:0 0 28px rgba(0,201,181,0.9)} }
        @keyframes sysGlowY  { 0%,100%{box-shadow:0 0 14px rgba(245,158,11,0.4)} 50%{box-shadow:0 0 28px rgba(245,158,11,0.8)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Dot indicator */}
      <div style={{
        width: 10, height: 10, borderRadius: "50%",
        background: m.dotColor,
        boxShadow: m.glow !== "none" ? m.glow : "none",
        animation: m.pulse ? "sysPulse 1.4s ease infinite" : "none",
        flexShrink: 0,
        transition: "background 0.4s ease, box-shadow 0.4s ease",
      }} />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, animation: "fadeSlide 0.3s ease" }} key={status}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: m.textColor,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "color 0.4s ease",
        }}>
          {m.label}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          color: "#1a202c",
          fontWeight: 600,
          marginTop: 2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {m.sub}
        </div>
      </div>

      {/* Status icon / spinner */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: status === "tracking" ? 16 : 14,
        color: m.dotColor,
        animation: status === "initializing" ? "sysSpin 2s linear infinite" : "none",
        flexShrink: 0,
        transition: "color 0.4s ease",
      }}>
        {status === "tracking" ? (
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={m.dotColor} strokeWidth={2.5} strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : status === "initializing" || status === "searching" ? (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={m.dotColor} strokeWidth={2} strokeLinecap="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        ) : (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={m.dotColor} strokeWidth={2} strokeLinecap="round">
            <circle cx="12" cy="12" r="9"/>
          </svg>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: 12,
    padding: "10px 16px",
    transition: "all 0.4s ease",
    userSelect: "none",
  },
};
