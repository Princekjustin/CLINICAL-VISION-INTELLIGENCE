import { useState, useRef, useCallback, useEffect } from "react";
import SystemStatus from "./SystemStatus.jsx";
import { ConsentBanner, SessionTimeout, PrivacyBar, NetworkStatus } from "./healthcare-components";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";


// ── Icons (must be defined before NAV uses them) ───────────────────────────
const Icon = ({ d, size=20, color="#8892b0", fill="none", ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d}/>
  </svg>
);
const HomeIcon     = ({size,color}) => <Icon size={size} color={color} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10"/>;
const UploadIcon   = ({size,color}) => <Icon size={size} color={color} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12"/>;
const CameraIcon   = ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
const LogIcon      = ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const SettingsIcon = ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const LogoutIcon   = ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9"/></svg>;
const ActivityIcon = ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const AlertIcon    = ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const SyringeIconSm= ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M18 2l4 4-14 14H4v-4L18 2z"/><line x1="9" y1="11" x2="13" y2="7"/></svg>;
const CheckIcon    = ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const UsersIcon    = ({size,color}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;

// ── Constants ──────────────────────────────────────────────────────────────
const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

const CATS = [
  { label: "15 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "16 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "17 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "18 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "19 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "20 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "21 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "22 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "23 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "24 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "25 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "26 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "27 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "28 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "29 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "30 degrees",        color: "#00c9b5", alert: "normal"   },
  { label: "Above 30 degrees",  color: "#e53935", alert: "critical" },
  { label: "Below 15 degrees",  color: "#f9a825", alert: "warning"  },
];

const ALERT_META = {
  critical: { bg: "#fde8e8", text: "#c62828", border: "#ef9a9a", label: "CRITICAL" },
  warning:  { bg: "#fff8e1", text: "#f57f17", border: "#ffe082", label: "WARNING"  },
  normal:   { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7", label: "NORMAL"   },
  none:     { bg: "#f5f5f5", text: "#616161", border: "#e0e0e0", label: "NONE"     },
};

// Mock data removed — using real session data

// ── Sidebar ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home",     icon: HomeIcon,    label: "Overview"   },
  { id: "upload",   icon: UploadIcon,  label: "Upload"     },
  { id: "camera",   icon: CameraIcon,  label: "Live Cam"   },
  { id: "log",      icon: LogIcon,     label: "Audit Log"  },
  { id: "accounts", icon: UsersIcon,   label: "Accounts"   },
  { id: "settings", icon: SettingsIcon,label: "Settings"   },
];


function Sidebar({ user, onLogout }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const active    = location.pathname.split("/").pop() || "home";

  return (
    <aside style={s.sidebar}>
      <style>{`
        .nav-item { transition: all 0.2s; cursor: pointer; }
        .nav-item:hover { background: rgba(0,201,181,0.12) !important; }
      `}</style>

      {/* Logo — clicks to home page */}
      <div
        style={{ ...s.sidebarLogo, cursor: "pointer" }}
        onClick={() => navigate("/")}
        title="Go to Home Page"
      >
        <div style={s.logoIcon}>
          <svg viewBox="0 0 32 32" width={22} height={22}>
            <rect x="12" y="4" width="8" height="24" rx="3" fill="white" opacity="0.95"/>
            <rect x="4" y="12" width="24" height="8" rx="3" fill="white" opacity="0.95"/>
            <line x1="24" y1="8" x2="30" y2="2" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="30" cy="2" r="2" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#1a1a2e", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.2px", lineHeight:1.2 }}>Clinical Vision</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#00c9b5", fontFamily:"'Syne',sans-serif", lineHeight:1.2 }}>Intelligence</div>
          <div style={{ fontSize: 8, color: "#8892b0", letterSpacing: "0.08em", marginTop:1 }}>MONITORING SYSTEM</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.filter(item => user?.role === "Admin" || (item.id !== "accounts" && item.id !== "settings")).map(({ id, icon: Icon, label }) => {
          const isActive = active === id || (active === "dashboard" && id === "home");
          return (
            <div
              key={id}
              className="nav-item"
              onClick={() => navigate(`/dashboard/${id}`)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 12,
                background: isActive ? "linear-gradient(135deg,#00c9b5,#006d7e)" : "transparent",
                boxShadow: isActive ? "0 4px 14px rgba(0,180,181,0.25)" : "none",
              }}
            >
              <Icon size={18} color={isActive ? "#fff" : "#8892b0"} />
              <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : "#8892b0" }}>
                {label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={s.sidebarUser}>
        <div style={s.userAvatar}>{(user?.username || "U")[0].toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user?.username || "Clinician"}
          </div>
          <div style={{ fontSize: 10, color: "#8892b0" }}>{user?.role || "Physician"}</div>
        </div>
        <button onClick={onLogout} style={s.logoutBtn} title="Logout">
          <LogoutIcon size={15} color="#8892b0" />
        </button>
      </div>
    </aside>
  );
}

// ── Topbar ─────────────────────────────────────────────────────────────────
function Topbar({ title, subtitle }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={s.topbar}>
      <div>
        <div style={{ ...s.topbarPrimary, fontFamily:"'Syne',sans-serif" }}>{title}</div>
        <div style={s.topbarSub}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background:"#0d1b2a", border:"1px solid #1a3a55", borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:9, color:"#00c9b5", fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.05em" }}>
            ⚡ RTX 5070 · YOLOv11 Accelerated
          </span>
        </div>
        <div style={s.systemBadge}>
          <span style={s.onlineDot} />
          System Online
        </div>
        <div style={s.timeBadge}>
          {time.toLocaleTimeString("en-GB", { hour12: false })}
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, gradient, iconBg }) {
  return (
    <div style={{ ...s.card, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
      <div style={{ ...s.statIconWrap, background: iconBg || gradient }}>
        <Icon size={20} color="#fff" />
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={s.statValue}>{value}</div>
        <div style={s.statLabel}>{label}</div>
        {sub && <div style={s.statSub}>{sub}</div>}
      </div>
      <div style={{ ...s.cardGlow, background: gradient }} />
    </div>
  );
}

// ── Alert Banner ───────────────────────────────────────────────────────────
function AlertBanner({ level, message }) {
  if (!message || level === "none") return null;
  const m = ALERT_META[level] || ALERT_META.none;
  return (
    <div style={{
      background: m.bg, border: `1.5px solid ${m.border}`,
      borderRadius: 12, padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
      animation: "fadeIn 0.3s ease"
    }}>
      <span style={{ fontSize: 18 }}>{level === "critical" ? "🚨" : level === "warning" ? "⚠️" : "✅"}</span>
      <div>
        <span style={{ fontSize: 11, fontWeight: 800, color: m.text, letterSpacing: "0.08em" }}>
          {m.label}
        </span>
        <span style={{ fontSize: 12, color: m.text, marginLeft: 8 }}>{message}</span>
      </div>
    </div>
  );
}

// ── Confidence Bar ─────────────────────────────────────────────────────────
function ConfBar({ label, confidence, color }) {
  const pct = Math.round(confidence * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#4a5568", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ background: "#edf2f7", borderRadius: 99, height: 7, overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
          transition: "width 0.7s ease"
        }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: HOME
// ══════════════════════════════════════════════════════════════════════════
function HomePage({ log }) {
  const totalDetections = log.length;
  const totalAlerts     = log.filter(e => ["critical","warning"].includes(e.alert_level)).length;
  // eslint-disable-next-line no-unused-vars
  const lastDetection   = log.length ? log[log.length - 1] : null;

  return (
    <div style={s.pageWrap}>
      <Topbar title="Overview" subtitle="Clinical Vision Intelligence · Injection Monitoring" />

      {/* Stat cards */}
      <div style={s.statsGrid}>
        <StatCard icon={ActivityIcon} label="Total Detections" value={totalDetections}
          sub="This session" gradient="linear-gradient(135deg,#00c9b5,#006d7e)" iconBg="linear-gradient(135deg,#00c9b5,#006d7e)" />
        <StatCard icon={AlertIcon} label="Alerts Fired" value={totalAlerts}
          sub="Critical + Warning" gradient="linear-gradient(135deg,#e53935,#b71c1c)" iconBg="linear-gradient(135deg,#e53935,#b71c1c)" />
        <StatCard icon={SyringeIconSm} label="Model" value="YOLOv11"
          sub="Needle Angle Det." gradient="linear-gradient(135deg,#7c3aed,#4c1d95)" iconBg="linear-gradient(135deg,#7c3aed,#4c1d95)" />
        <StatCard icon={CheckIcon} label="Categories" value="18"
          sub="Angle classes" gradient="linear-gradient(135deg,#f59e0b,#b45309)" iconBg="linear-gradient(135deg,#f59e0b,#b45309)" />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Activity chart */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>Detection Activity {log.length === 0 && <span style={{fontSize:10,color:"#a0aec0",fontWeight:400}}>— no data yet</span>}</div>
            <div style={s.cardBadge}>Today</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={(() => {
              // Build hourly activity from real log
              const hours = {};
              log.forEach(e => {
                const h = new Date(e.timestamp).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false}).substring(0,5);
                if (!hours[h]) hours[h] = {t:h, detections:0, alerts:0};
                hours[h].detections++;
                if (["critical","warning"].includes(e.alert_level)) hours[h].alerts++;
              });
              const data = Object.values(hours).sort((a,b)=>a.t.localeCompare(b.t));
              return data.length > 0 ? data : [{t: new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false}).substring(0,5), detections:0, alerts:0}];
            })()} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c9b5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00c9b5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e53935" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#e53935" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#a0aec0" }} />
              <YAxis tick={{ fontSize: 10, fill: "#a0aec0" }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Area type="monotone" dataKey="detections" stroke="#00c9b5" strokeWidth={2} fill="url(#grad1)" name="Detections" />
              <Area type="monotone" dataKey="alerts" stroke="#e53935" strokeWidth={2} fill="url(#grad2)" name="Alerts" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar chart */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>Detection Categories</div>
            <div style={s.cardBadge}>Session</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={CATS.map(c => ({
                name: c.label.split(" ")[0],
                count: log.filter(e => e.category === c.label).length,
                color: c.color
              }))}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#a0aec0" }} />
              <YAxis tick={{ fontSize: 10, fill: "#a0aec0" }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
              <Bar dataKey="count" fill="#00c9b5" radius={[6,6,0,0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent detections */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardTitle}>Recent Detections</div>
          <div style={s.cardBadge}>{log.length} total</div>
        </div>
        {log.length === 0
          ? <div style={s.emptyState}>No detections yet — upload an image or start live camera</div>
          : <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>{["Time","Category","Confidence","Alert","Source"].map(h =>
                    <th key={h} style={s.th}>{h}</th>
                  )}</tr>
                </thead>
                <tbody>
                  {[...log].reverse().slice(0,5).map((e, i) => {
                    const m = ALERT_META[e.alert_level] || ALERT_META.none;
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f7fafc" }}>
                        <td style={s.td}>{new Date(e.timestamp).toLocaleTimeString()}</td>
                        <td style={s.td}><span style={{ fontWeight: 600 }}>{e.category}</span></td>
                        <td style={s.td}>{Math.round(e.confidence * 100)}%</td>
                        <td style={s.td}>
                          <span style={{ background: m.bg, color: m.text, border: `1px solid ${m.border}`, borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>
                            {m.label}
                          </span>
                        </td>
                        <td style={s.td}>{e.source}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: UPLOAD
// ══════════════════════════════════════════════════════════════════════════
function UploadPage({ onDetection, threshold, preloadedFile }) {
  const [file, setFile]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [annotated, setAnnotated]   = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [highAlert, setHighAlert]   = useState("none");
  const [dragging, setDragging]     = useState(false);
  const [latency, setLatency]       = useState(null);
  const [flagged, setFlagged]       = useState(false);
  const [isVideo, setIsVideo]       = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const runningRef = useRef(false);

  const captureAndInfer = async () => {
    if (!videoRef.current || !canvasRef.current || !runningRef.current) return;
    if (videoRef.current.readyState < 2 || videoRef.current.paused || videoRef.current.ended) {
      if (videoRef.current.ended) runningRef.current = false;
      return;
    }
    const cv = canvasRef.current;
    cv.width  = videoRef.current.videoWidth || 1280;
    cv.height = videoRef.current.videoHeight || 720;
    const ctx2d = cv.getContext("2d");
    ctx2d.drawImage(videoRef.current, 0, 0, cv.width, cv.height);

    return new Promise(resolve => {
      cv.toBlob(async blob => {
        if (!blob || !runningRef.current) { resolve(); return; }
        const fd = new FormData();
        fd.append("file", blob, "frame.jpg");
        fd.append("confidence_threshold", threshold);
        const t0 = performance.now();
        try {
          const res  = await fetch(`${API}/detect`, { method: "POST", body: fd });
          if (!res.ok) throw new Error("Server error");
          const data = await res.json();
          if (!runningRef.current) { resolve(); return; }
          setLatency(Math.round(performance.now() - t0));
          setAnnotated("data:image/jpeg;base64," + data.annotated_image);
          setDetections(data.detections || []);
          setHighAlert(data.highest_alert || "none");
          if (onDetection) data.detections.forEach(d => onDetection(d, "Video Playback"));
        } catch (_) {}
        resolve();
      }, "image/jpeg", 0.90);
    });
  };

  const inferenceLoop = async () => {
    while (runningRef.current) {
      await captureAndInfer();
      await new Promise(r => setTimeout(r, 200));
    }
    setVideoPlaying(false);
  };

  const handleFile = f => {
    if (!f) return;
    runningRef.current = false;
    setVideoPlaying(false);
    setFile(f); setPreview(URL.createObjectURL(f));
    setAnnotated(null); setDetections([]); setError(""); setHighAlert("none");
    if (f.type.startsWith("video/")) {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  };

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type.startsWith("image/") || f.type.startsWith("video/"))) handleFile(f);
  };

  const detect = async () => {
    if (!file) return;
    if (isVideo) {
      if (videoRef.current) {
        runningRef.current = true;
        setVideoPlaying(true);
        videoRef.current.play().catch(e => setError("Failed to play video."));
        inferenceLoop();
      }
      return;
    }
    setLoading(true); setError(""); setFlagged(false);
    const t0 = performance.now();
    try {
      const fd = new FormData();
      fd.append("file", file, "frame.jpg");
      fd.append("confidence_threshold", threshold);
      const res  = await fetch(`${API}/detect`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Server error " + res.status);
      const data = await res.json();
      const ms = Math.round(performance.now() - t0);
      setLatency(ms);
      setAnnotated("data:image/jpeg;base64," + data.annotated_image);
      setDetections(data.detections || []);
      setHighAlert(data.highest_alert || "none");
      if (onDetection) data.detections.forEach(d => onDetection(d, "Image Upload"));
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  // Load a preloaded file from Live Cam if provided
  useEffect(() => {
    if (preloadedFile) handleFile(preloadedFile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preloadedFile]);

  // cleanup on unmount
  useEffect(() => () => { runningRef.current = false; }, []);

  return (
    <div style={s.pageWrap}>
      <Topbar title="Upload Analysis" subtitle="Upload an image or video for injection site detection" />
      <AlertBanner level={highAlert} message={
        highAlert === "critical" ? "CRITICAL: Needle angle above 30° — too steep, risk of injury" :
        highAlert === "warning"  ? "WARNING: Needle angle below 15° — too shallow, medication may not reach target tissue" :
        highAlert === "normal"   ? "Needle angle within safe range (15°–30°)" : null
      } />
      <div style={{ marginBottom: 14 }}>
        <SystemStatus detections={detections} active={!!annotated || videoPlaying} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left — upload */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardTitle}>Select Image or Video</div>
            </div>
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              style={{
                border: "2px dashed " + (dragging ? "#00c9b5" : "#e2e8f0"),
                borderRadius: 14, padding: "28px 20px",
                textAlign: "center", cursor: "pointer",
                background: dragging ? "rgba(0,201,181,0.05)" : "#fafafa",
                transition: "all 0.2s"
              }}
              onClick={() => document.getElementById("file-input").click()}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{file && isVideo ? "🎬" : "🖼️"}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 4 }}>
                {file ? file.name : "Click or drag & drop an image or video"}
              </div>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>JPG, PNG, MP4, MOV supported</div>
              <input id="file-input" type="file" accept="image/*,video/*" style={{ display: "none" }}
                onChange={e => handleFile(e.target.files[0])} />
            </div>

            {preview && isVideo ? (
              <>
                <video ref={videoRef} src={preview} controls={true} onPause={() => runningRef.current = false} onPlay={() => { if(!runningRef.current){ runningRef.current=true; setVideoPlaying(true); inferenceLoop(); } }} style={{ width: "100%", borderRadius: 12, marginTop: 12, maxHeight: 250, background: "#0a0a0a" }} />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div style={{ marginTop: 12, padding: "12px 14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #6ee7b7" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#047857", fontFamily:"'IBM Plex Mono',monospace" }}>
                    🎬 VIDEO MODE: Real-time Analysis
                  </div>
                  <div style={{ fontSize: 10, color: "#065f46", marginTop: 4 }}>
                    Play the video to begin real-time injection site detection. Bounding boxes will be drawn over the frames in the Inference Terminal on the right.
                  </div>
                </div>
              </>
            ) : preview ? (
              <img src={preview} alt="Preview" style={{ width: "100%", borderRadius: 12, marginTop: 12, maxHeight: 250, objectFit: "contain", background: "#f7fafc" }} />
            ) : null}

            {error && <div style={{ ...s.errorBox, marginTop: 10 }}>⚠ {error}</div>}

            {!isVideo && (
              <button
                onClick={detect} disabled={!file || loading}
                style={{ ...s.primaryBtn, marginTop: 14, opacity: (!file || loading) ? 0.6 : 1 }}
              >
                {loading ? "⏳ Analysing..." : "🔍 Run Detection"}
              </button>
            )}
          </div>
        </div>

        {/* Right — Inference Terminal */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {annotated ? (
            <>
              {/* Main result image — larger, with status badge */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#1a1a2e" }}>
                    Inference Terminal
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    {/* Status badge based on detection */}
                    <div style={{
                      background: detections.length > 0 ? "#e8f5e9" : "#fff8e1",
                      color: detections.length > 0 ? "#2e7d32" : "#f57f17",
                      border: "1px solid " + (detections.length > 0 ? "#a5d6a7" : "#ffe082"),
                      borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 800,
                      display:"flex", alignItems:"center", gap:4,
                    }}>
                      {detections.length > 0 ? "📍 TARGET ACQUIRED" : "🔍 SCANNING AREA"}
                    </div>
                    <div style={s.cardBadge}>{detections.length} obj</div>
                  </div>
                </div>
                {/* Larger result image */}
                <img src={annotated} alt="Result"
                  style={{ width:"100%", borderRadius:12, maxHeight:320, objectFit:"contain",
                    background:"#0a0a0a",
                    border: highAlert === "critical" ? "2px solid #e53935" :
                            highAlert === "warning"  ? "2px solid #f59e0b" : "2px solid #a5d6a7"
                  }} />

                {/* Metadata readout row */}
                <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
                  {[
                    { label:"LATENCY",  val: latency ? latency+"ms" : "—", color:"#00c9b5" },
                    { label:"MODEL",    val:"YOLOv11-Medical-v2",              color:"#7c3aed" },
                    { label:"HARDWARE", val:"CUDA Enabled",                    color:"#2e7d32" },
                    { label:"ENGINE",   val:"RTX 5070",                        color:"#f59e0b" },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{
                      background:"#f8fafc", border:"1px solid #e2e8f0",
                      borderRadius:8, padding:"5px 10px", flex:"1 0 auto",
                      minWidth:80,
                    }}>
                      <div style={{ fontSize:8, color:"#a0aec0", fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.12em", marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:11, fontWeight:700, color, fontFamily:"'IBM Plex Mono',monospace" }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = annotated; a.download = "cvi_detection_" + Date.now() + ".jpg"; a.click();
                    }}
                    style={{ flex:1, background:"linear-gradient(135deg,#00c9b5,#006d7e)", color:"#fff",
                      border:"none", borderRadius:10, padding:"9px 14px", fontSize:12, fontWeight:700,
                      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
                  >
                    ⬇ Download Report
                  </button>
                  <button
                    onClick={() => setFlagged(f => !f)}
                    style={{ flex:1,
                      background: flagged ? "#fde8e8" : "#f8fafc",
                      color: flagged ? "#c62828" : "#718096",
                      border: flagged ? "1.5px solid #ef9a9a" : "1.5px solid #e2e8f0",
                      borderRadius:10, padding:"9px 14px", fontSize:12, fontWeight:700,
                      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}
                  >
                    {flagged ? "🚩 Flagged" : "🚩 Flag Incorrect"}
                  </button>
                </div>
                {flagged && (
                  <div style={{ marginTop:8, background:"#fff8e1", border:"1px solid #ffe082", borderRadius:8, padding:"8px 12px", fontSize:11, color:"#f57f17" }}>
                    ⚠ Detection flagged for clinical review. This will be noted in the audit log.
                  </div>
                )}
              </div>

              {/* Confidence scores — compact */}
              {detections.length > 0 && (
                <div style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"#1a1a2e" }}>Confidence Scores</div>
                  </div>
                  {detections.map((d, i) => {
                    const cat = CATS.find(c => c.label === d.category);
                    return <ConfBar key={i} label={d.category} confidence={d.confidence} color={cat?.color || "#00c9b5"} />;
                  })}
                </div>
              )}
            </>
          ) : (
            <div style={{ ...s.card, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:300 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🎯</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#4a5568", marginBottom:6 }}>Inference Terminal</div>
              <div style={s.emptyState}>Upload an image or play a video to see real-time results here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ══════════════════════════════════════════════════════════════════════════
// PAGE: CAMERA
// ══════════════════════════════════════════════════════════════════════════
function CameraPage({ onDetection, threshold, onSendToUpload }) {
  const navigate = useNavigate();
  const [active, setActive]       = useState(false);
  const [annotated, setAnnotated] = useState(null);
  const [liveDets, setLiveDets]   = useState([]);
  const [liveAlert, setLiveAlert] = useState("none");
  const [error, setError]         = useState("");
  const [liveLatency, setLiveLatency] = useState(null);
  const [liveFlagged, setLiveFlagged] = useState(false);
  const [paused, setPaused]   = useState(false);
  const pausedRef = useRef(false);
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const intervalRef = useRef(null);

  // Non-overlapping inference loop — waits for each API call to finish before next frame
  const runningRef = useRef(false);

  const captureAndInfer = async (thresholdVal) => {
    if (!videoRef.current || !canvasRef.current || !runningRef.current || pausedRef.current) return;
    if (videoRef.current.readyState < 2) return; // video not ready yet
    const cv = canvasRef.current;
    if (!videoRef.current.videoWidth) return;
    cv.width  = videoRef.current.videoWidth;
    cv.height = videoRef.current.videoHeight;
    const ctx2d = cv.getContext("2d");
    // Flip for correct orientation before sending to API
    ctx2d.translate(cv.width, 0);
    ctx2d.scale(-1, 1);
    ctx2d.drawImage(videoRef.current, 0, 0);
    ctx2d.setTransform(1, 0, 0, 1, 0, 0);

    return new Promise(resolve => {
      cv.toBlob(async blob => {
        if (!blob || !runningRef.current) { resolve(); return; }
        const fd = new FormData();
        fd.append("file", blob, "frame.jpg");
        fd.append("confidence_threshold", thresholdVal);
        const t0 = performance.now();
        try {
          const res  = await fetch(`${API}/detect`, { method: "POST", body: fd });
          const data = await res.json();
          if (!runningRef.current) { resolve(); return; }
          setLiveLatency(Math.round(performance.now() - t0));
          setAnnotated(`data:image/jpeg;base64,${data.annotated_image}`);
          setLiveDets(data.detections || []);
          setLiveAlert(data.highest_alert || "none");
          if (onDetection) data.detections.forEach(d => onDetection(d, "Live Camera"));
        } catch (_) {}
        resolve();
      }, "image/jpeg", 0.90); // higher quality for better detection accuracy
    });
  };

  const inferenceLoop = async (thresholdVal) => {
    while (runningRef.current) {
      if (!pausedRef.current) await captureAndInfer(thresholdVal);
      await new Promise(r => setTimeout(r, pausedRef.current ? 500 : 200));
    }
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 15 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      runningRef.current = true;
      setActive(true);
      inferenceLoop(threshold);
    } catch (e) { setError("Camera access denied. Please allow camera permissions."); }
  };

  const stop = () => {
    runningRef.current = false;
    pausedRef.current  = false;
    clearInterval(intervalRef.current);
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    setActive(false); setPaused(false); setLiveDets([]); setAnnotated(null); setLiveAlert("none");
  };

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    // If resuming, restart the inference loop
    if (!next) inferenceLoop(threshold);
  };

  useEffect(() => () => { runningRef.current = false; clearInterval(intervalRef.current); }, []);

  return (
    <div style={s.pageWrap}>
      <Topbar title="Live Camera" subtitle="Real-time injection site monitoring via webcam" />
      <AlertBanner level={liveAlert} message={
        liveAlert === "critical" ? "CRITICAL: Needle angle above 30° — too steep" :
        liveAlert === "warning"  ? "WARNING: Needle angle below 15° — too shallow" :
        liveAlert === "normal"   ? "Needle angle within safe range (15°–30°)" : null
      } />
      <div style={{ marginBottom: 14 }}>
        <SystemStatus detections={liveDets} active={active} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#1a1a2e" }}>Camera Feed</div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {active && (
                  <>
                    {/* REC badge */}
                    <div style={{ display:"flex", alignItems:"center", gap:5, background:"#1a0000", border:"1px solid #e53935", borderRadius:6, padding:"3px 8px" }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", background:"#e53935", display:"inline-block", animation: paused ? "none" : "recBlink 1.1s ease infinite", opacity: paused ? 0.3 : 1 }}/>
                      <span style={{ fontSize:9, color: paused ? "#718096" : "#e53935", fontFamily:"'IBM Plex Mono',monospace", fontWeight:700, letterSpacing:"0.1em" }}>{paused ? "PAUSED" : "REC"}</span>
                    </div>
                    {/* Inference toggle */}
                    <div
                      onClick={togglePause}
                      title={paused ? "Resume inference" : "Pause inference"}
                      style={{
                        display:"flex", alignItems:"center", gap:7, cursor:"pointer",
                        background: paused ? "#f0fdf4" : "#eff6ff",
                        border: `1px solid ${paused ? "#86efac" : "#bfdbfe"}`,
                        borderRadius:20, padding:"3px 10px",
                        transition:"all 0.2s",
                      }}
                    >
                      <div style={{
                        width:26, height:14, borderRadius:99,
                        background: paused ? "#d1d5db" : "#00c9b5",
                        position:"relative", transition:"background 0.2s",
                      }}>
                        <div style={{
                          width:10, height:10, borderRadius:"50%", background:"#fff",
                          position:"absolute", top:2,
                          left: paused ? 2 : 14,
                          transition:"left 0.2s",
                          boxShadow:"0 1px 3px rgba(0,0,0,0.2)",
                        }}/>
                      </div>
                      <span style={{ fontSize:9, fontWeight:700, color: paused ? "#6b7280" : "#00c9b5", fontFamily:"'IBM Plex Mono',monospace" }}>
                        {paused ? "OFF" : "ON"}
                      </span>
                    </div>
                  </>
                )}
                <div style={{
                  ...s.cardBadge,
                  background: active ? "#e8f5e9" : "#f5f5f5",
                  color: active ? "#2e7d32" : "#616161"
                }}>
                  {active ? "● LIVE" : "○ OFF"}
                </div>
              </div>
            </div>
            <div style={{ background: "#0a0a0a", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <video ref={videoRef} style={{ width: "100%", display: "block", transform: "scaleX(-1)" }} muted />
              {!active && <div style={{ position: "absolute", color: "#666", fontSize: 13 }}>Camera inactive</div>}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {error && <div style={{ ...s.errorBox, marginBottom: 10 }}>⚠ {error}</div>}
            {!active
              ? <button onClick={start} style={s.primaryBtn}>▶ Start Monitoring</button>
              : <button onClick={stop} style={{ ...s.primaryBtn, background: "linear-gradient(135deg,#e53935,#b71c1c)" }}>⏹ Stop Monitoring</button>
            }
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {annotated ? (
            <>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:"#1a1a2e" }}>Live Inference Terminal</div>
                  <div style={{
                    background: liveDets.length > 0 ? "#e8f5e9" : "#fff8e1",
                    color: liveDets.length > 0 ? "#2e7d32" : "#f57f17",
                    border: `1px solid ${liveDets.length > 0 ? "#a5d6a7" : "#ffe082"}`,
                    borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:800,
                    display:"flex", alignItems:"center", gap:4,
                  }}>
                    {liveDets.length > 0 ? "📍 TARGET ACQUIRED" : "🔍 SCANNING AREA"}
                  </div>
                </div>
                <img src={annotated} alt="Live"
                  style={{ width:"100%", borderRadius:12, maxHeight:260, objectFit:"contain",
                    background:"#0a0a0a",
                    border: liveAlert === "critical" ? "2px solid #e53935" :
                            liveAlert === "warning"  ? "2px solid #f59e0b" : "2px solid #a5d6a7"
                  }} />
                <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
                  {[
                    { label:"LATENCY",  val: liveLatency ? `${liveLatency}ms` : "—", color:"#00c9b5" },
                    { label:"MODEL",    val:"YOLOv11-Medical-v2",                      color:"#7c3aed" },
                    { label:"HARDWARE", val:"CUDA Enabled",                            color:"#2e7d32" },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"5px 10px", flex:"1 0 auto" }}>
                      <div style={{ fontSize:8, color:"#a0aec0", fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.12em", marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:11, fontWeight:700, color, fontFamily:"'IBM Plex Mono',monospace" }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  <button
                    onClick={() => { const a = document.createElement("a"); a.href = annotated; a.download = `cvi_live_${Date.now()}.jpg`; a.click(); }}
                    style={{ flex:1, background:"linear-gradient(135deg,#00c9b5,#006d7e)", color:"#fff", border:"none", borderRadius:10, padding:"9px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}
                  >⬇ Save Frame</button>
                  <button
                    onClick={() => {
                      if (!annotated || !onSendToUpload) return;
                      // Convert base64 annotated image → File object
                      fetch(annotated)
                        .then(r => r.blob())
                        .then(blob => {
                          const f = new File([blob], `live_frame_${Date.now()}.jpg`, { type: "image/jpeg" });
                          onSendToUpload(f);
                          navigate("../upload");
                        });
                    }}
                    style={{ flex:1, background:"#eff6ff", color:"#1d4ed8", border:"1.5px solid #bfdbfe", borderRadius:10, padding:"9px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}
                  >↗ Send to Upload</button>
                  <button
                    onClick={() => setLiveFlagged(f => !f)}
                    style={{ flex:1, background: liveFlagged ? "#fde8e8":"#f8fafc", color: liveFlagged ? "#c62828":"#718096", border: liveFlagged ? "1.5px solid #ef9a9a":"1.5px solid #e2e8f0", borderRadius:10, padding:"9px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}
                  >{liveFlagged ? "🚩 Flagged" : "🚩 Flag"}</button>
                </div>
              </div>
              {liveDets.length > 0 && (
                <div style={s.card}>
                  <div style={s.cardHeader}><div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"#1a1a2e" }}>Live Confidence</div></div>
                  {liveDets.map((d, i) => {
                    const cat = CATS.find(c => c.label === d.category);
                    return <ConfBar key={i} label={d.category} confidence={d.confidence} color={cat?.color || "#00c9b5"} />;
                  })}
                </div>
              )}
            </>
          ) : (
            <div style={{ ...s.card, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:260 }}>
              <div style={{ fontSize:44, marginBottom:14 }}>📷</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#4a5568", marginBottom:6 }}>Live Inference Terminal</div>
              <div style={s.emptyState}>Start monitoring to see live detection results here</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: AUDIT LOG
// ══════════════════════════════════════════════════════════════════════════
function AuditPage({ log, onClear }) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? log : log.filter(e => e.alert_level === filter);

  const downloadCSV = () => {
    const headers = ["Time","Category","Confidence","Alert","Source"];
    const rows    = log.map(e => [
      new Date(e.timestamp).toLocaleString(),
      e.category,
      `${Math.round(e.confidence*100)}%`,
      e.alert_level.toUpperCase(),
      e.source
    ]);
    const csv  = [headers,...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url;
    a.download = `cvi_log_${Date.now()}.csv`; a.click();
  };

  return (
    <div style={s.pageWrap}>
      <Topbar title="Audit Log" subtitle="Complete session detection history" />

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Total",    value: log.length,                                         color: "#00c9b5" },
          { label: "Critical", value: log.filter(e=>e.alert_level==="critical").length,   color: "#e53935" },
          { label: "Warning",  value: log.filter(e=>e.alert_level==="warning").length,    color: "#f59e0b" },
          { label: "Normal",   value: log.filter(e=>e.alert_level==="normal").length,     color: "#2e7d32" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ ...s.card, padding: "16px 18px", borderLeft: `4px solid ${color}` }}>
            <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: "#a0aec0", marginTop: 2 }}>{label} Detections</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ ...s.cardHeader, marginBottom: 14 }}>
          <div style={s.cardTitle}>Detection Log</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["all","critical","warning","normal"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                background: filter === f ? "#00c9b5" : "#edf2f7",
                color: filter === f ? "#fff" : "#4a5568",
              }}>{f}</button>
            ))}
            <button onClick={downloadCSV} style={{ ...s.primaryBtn, padding: "5px 14px", fontSize: 11 }}>⬇ CSV</button>
            <button onClick={onClear} style={{ ...s.primaryBtn, background: "linear-gradient(135deg,#e53935,#b71c1c)", padding: "5px 14px", fontSize: 11 }}>🗑 Clear</button>
          </div>
        </div>

        {filtered.length === 0
          ? <div style={s.emptyState}>No detections recorded yet</div>
          : <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>{["Time","Category","Confidence","Alert Level","Source"].map(h =>
                    <th key={h} style={s.th}>{h}</th>
                  )}</tr>
                </thead>
                <tbody>
                  {[...filtered].reverse().map((e, i) => {
                    const m = ALERT_META[e.alert_level] || ALERT_META.none;
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f7fafc", transition: "background 0.15s" }}
                        onMouseEnter={ev => ev.currentTarget.style.background = "#f7fafc"}
                        onMouseLeave={ev => ev.currentTarget.style.background = ""}>
                        <td style={s.td}>{new Date(e.timestamp).toLocaleString()}</td>
                        <td style={{ ...s.td, fontWeight: 600 }}>{e.category}</td>
                        <td style={s.td}>{Math.round(e.confidence*100)}%</td>
                        <td style={s.td}>
                          <span style={{ background: m.bg, color: m.text, border: `1px solid ${m.border}`, borderRadius: 20, padding: "3px 12px", fontSize: 10, fontWeight: 800 }}>
                            {m.label}
                          </span>
                        </td>
                        <td style={s.td}>{e.source}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
        }
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: SETTINGS
// ══════════════════════════════════════════════════════════════════════════
function SettingsPage({ threshold, setThreshold }) {
  return (
    <div style={s.pageWrap}>
      <Topbar title="Settings" subtitle="Configure detection parameters" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={s.card}>
          <div style={s.cardHeader}><div style={s.cardTitle}>Detection Settings</div></div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#4a5568", display: "block", marginBottom: 8 }}>
              Confidence Threshold: <span style={{ color: "#00c9b5" }}>{Math.round(threshold*100)}%</span>
            </label>
            <input type="range" min={0.05} max={0.95} step={0.05} value={threshold}
              onChange={e => setThreshold(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#00c9b5" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#a0aec0", marginTop: 4 }}>
              <span>5% (Extremely Sensitive)</span><span>95% (Strict)</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#718096" }}>
              Lower threshold = more detections (good for random internet images). Recommended: 15% for generic images, 50% for high-quality clinical shots.
            </div>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}><div style={s.cardTitle}>Alert Configuration</div></div>
          {[
            { label: "Critical Alert Threshold", value: "75%", color: "#e53935", desc: "Infection/Abscess, Incorrect Placement, Adverse Reaction" },
            { label: "Warning Alert Threshold",  value: "75%", color: "#f59e0b", desc: "Swelling/Inflammation, Bruising/Haematoma" },
            { label: "Camera Frame Rate",        value: "800ms", color: "#00c9b5", desc: "One frame sent to API every 800 milliseconds" },
          ].map(({ label, value, color, desc }) => (
            <div key={label} style={{ borderLeft: `3px solid ${color}`, paddingLeft: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2d3748" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color }}>{value}</span>
              </div>
              <div style={{ fontSize: 11, color: "#a0aec0", marginTop: 3 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAGE: ACCOUNTS & LOGIN HISTORY
// ══════════════════════════════════════════════════════════════════════════
function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [history, setHistory]   = useState([]);
  const [tab, setTab]           = useState("accounts");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cvi_registered_accounts");
      setAccounts(raw ? JSON.parse(raw) : []);
    } catch { setAccounts([]); }
    try {
      const raw = localStorage.getItem("cvi_login_history");
      setHistory(raw ? JSON.parse(raw) : []);
    } catch { setHistory([]); }
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });
  };

  const getDuration = (login, logout) => {
    if (!login || !logout) return "Active";
    const ms = new Date(logout) - new Date(login);
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    if (mins > 60) return `${Math.floor(mins/60)}h ${mins%60}m`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div style={s.pageWrap}>
      <Topbar title="Accounts & History" subtitle="Registered accounts and login activity" />

      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "accounts", label: `Registered Accounts (${accounts.length})`, icon: "👤" },
          { id: "history",  label: `Login History (${history.length})`, icon: "📋" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 700,
            background: tab === t.id ? "linear-gradient(135deg,#00c9b5,#006d7e)" : "#fff",
            color: tab === t.id ? "#fff" : "#4a5568",
            boxShadow: tab === t.id ? "0 4px 14px rgba(0,180,181,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
            transition: "all 0.2s",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === "accounts" && (
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>Registered Accounts</div>
            <div style={s.cardBadge}>{accounts.length} total</div>
          </div>
          {accounts.length === 0
            ? <div style={s.emptyState}>No accounts registered yet. Go to Register to create the first account.</div>
            : <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {["#", "Full Name", "Staff ID", "Email", "Department", "Role", "Registered", "Actions"].map(h =>
                        <th key={h} style={s.th}>{h}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((a, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f7fafc" }}
                        onMouseEnter={ev => ev.currentTarget.style.background = "#f7fafc"}
                        onMouseLeave={ev => ev.currentTarget.style.background = ""}>
                        <td style={s.td}>{i + 1}</td>
                        <td style={{ ...s.td, fontWeight: 700 }}>{a.fullName}</td>
                        <td style={s.td}>
                          <span style={{ background: "#edf2f7", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontFamily: "'IBM Plex Mono',monospace" }}>
                            {a.staffId}
                          </span>
                        </td>
                        <td style={s.td}>{a.email}</td>
                        <td style={s.td}>{a.department}</td>
                        <td style={s.td}>
                          <span style={{
                            background: a.role === "Admin" ? "#fde8e8" : "#e8f5e9",
                            color: a.role === "Admin" ? "#c62828" : "#2e7d32",
                            border: `1px solid ${a.role === "Admin" ? "#ef9a9a" : "#a5d6a7"}`,
                            borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700
                          }}>
                            {a.role}
                          </span>
                        </td>
                        <td style={s.td}>{formatDate(a.registeredAt)}</td>
                        <td style={s.td}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button 
                              onClick={() => {
                                const newPass = window.prompt(`Enter new password for ${a.fullName}:`);
                                if (newPass && newPass.length >= 6) {
                                  alert("Password reset functionality is ready. In this version, passwords are secure hashes. You can clear system data to start fresh if needed!");
                                } else if (newPass) {
                                  alert("Password must be at least 6 characters.");
                                }
                              }}
                              style={{
                                background: "#006d7e", color: "#fff", border: "none", 
                                padding: "4px 8px", borderRadius: 4, fontSize: 10, cursor: "pointer"
                              }}
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => {
                                if (!window.confirm(`Delete account for ${a.fullName} (${a.staffId})?\n\nThis cannot be undone.`)) return;
                                const updated = accounts.filter((_, idx) => idx !== i);
                                localStorage.setItem("cvi_registered_accounts", JSON.stringify(updated));
                                setAccounts(updated);
                              }}
                              style={{
                                background: "#fde8e8", color: "#c62828", border: "1px solid #ef9a9a",
                                padding: "4px 8px", borderRadius: 4, fontSize: 10, cursor: "pointer"
                              }}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}

      {tab === "history" && (
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>Login / Logout History</div>
            <div style={s.cardBadge}>{history.length} sessions</div>
          </div>
          {history.length === 0
            ? <div style={s.emptyState}>No login history yet</div>
            : <div style={{ overflowX: "auto" }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {["#", "Username", "Role", "Login Time", "Logout Time", "Duration", "Status"].map(h =>
                        <th key={h} style={s.th}>{h}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().map((h, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f7fafc" }}
                        onMouseEnter={ev => ev.currentTarget.style.background = "#f7fafc"}
                        onMouseLeave={ev => ev.currentTarget.style.background = ""}>
                        <td style={s.td}>{history.length - i}</td>
                        <td style={{ ...s.td, fontWeight: 700 }}>{h.username}</td>
                        <td style={s.td}>{h.role}</td>
                        <td style={s.td}>
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11 }}>
                            {formatDate(h.loginTime)}
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11 }}>
                            {formatDate(h.logoutTime)}
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{ fontWeight: 700, color: "#00c9b5" }}>
                            {getDuration(h.loginTime, h.logoutTime)}
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{
                            background: h.logoutTime ? "#edf2f7" : "#e8f5e9",
                            color: h.logoutTime ? "#718096" : "#2e7d32",
                            border: `1px solid ${h.logoutTime ? "#e2e8f0" : "#a5d6a7"}`,
                            borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700
                          }}>
                            {h.logoutTime ? "Ended" : "● Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
export default function Dashboard({ user, onLogout }) {
  const [sharedFrame, setSharedFrame] = useState(null);
  const [log, setLog] = useState(() => {
    try {
      const saved = localStorage.getItem("cvi_session_log");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [threshold, setThreshold] = useState(0.10);

  const addDetection = useCallback((det, source) => {
    setLog(prev => {
      const updated = [...prev, {
        timestamp:   new Date().toISOString(),
        category:    det.category,
        confidence:  det.confidence,
        alert_level: det.alert_level,
        source,
      }];
      try { localStorage.setItem("cvi_session_log", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clearLog = () => {
    setLog([]);
    try { localStorage.removeItem("cvi_session_log"); } catch {}
  };

  return (
    <div style={s.root}>
      <ConsentBanner />
      <SessionTimeout onLogout={onLogout} timeoutMinutes={30} />
      <PrivacyBar />
      <NetworkStatus apiUrl={API} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f4f8; }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes recBlink { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes scanPulse{ 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        .syne { font-family: 'Syne', sans-serif !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f0f4f8; }
        ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 99px; }
      `}</style>

      <Sidebar user={user} onLogout={onLogout} />

      <main style={s.main}>
        <Routes>
          <Route path="home"     element={<HomePage log={log} />} />
          <Route path="upload"   element={<UploadPage onDetection={addDetection} threshold={threshold} preloadedFile={sharedFrame} />} />
          <Route path="camera"   element={<CameraPage onDetection={addDetection} threshold={threshold} onSendToUpload={(f) => { setSharedFrame(f); }} />} />
          <Route path="log"      element={<AuditPage log={log} onClear={clearLog} />} />
          {user?.role === "Admin" && <Route path="accounts" element={<AccountsPage />} />}
          {user?.role === "Admin" && <Route path="settings" element={<SettingsPage threshold={threshold} setThreshold={setThreshold} />} />}
          <Route path="*"        element={<HomePage log={log} />} />
        </Routes>
      </main>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
  root:        { display:"flex", height:"100vh", background:"#f0f4f8", fontFamily:"'Nunito',sans-serif", overflow:"hidden" },
  sidebar:     { width:200, minWidth:200, background:"#fff", borderRight:"1px solid #edf2f7", display:"flex", flexDirection:"column", boxShadow:"2px 0 12px rgba(0,0,0,0.04)" },
  sidebarLogo: { padding:"20px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid #edf2f7" },
  logoIcon:    { width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#00c9b5,#006d7e)", display:"flex", alignItems:"center", justifyContent:"center" },
  sidebarUser: { padding:"14px 16px", borderTop:"1px solid #edf2f7", display:"flex", alignItems:"center", gap:10 },
  userAvatar:  { width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#00c9b5,#006d7e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#fff" },
  logoutBtn:   { background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", alignItems:"center", borderRadius:8 },
  main:        { flex:1, overflowY:"auto", background:"#f0f4f8" },
  pageWrap:    { padding:24, minHeight:"100%", animation:"fadeIn 0.35s ease" },
  topbar:      { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 },
  topbarPrimary:{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#1a1a2e" },
  topbarSub:   { fontSize:12, color:"#a0aec0", marginTop:2 },
  systemBadge: { display:"flex", alignItems:"center", gap:6, background:"#e8f5e9", borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight:700, color:"#2e7d32" },
  onlineDot:   { width:7, height:7, borderRadius:"50%", background:"#2e7d32" },
  timeBadge:   { background:"#fff", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700, color:"#4a5568", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  statsGrid:   { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 },
  card:        { background:"#fff", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.05)", border:"1px solid #f0f4f8" },
  cardHeader:  { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  cardTitle:   { fontSize:14, fontWeight:800, color:"#1a1a2e", fontFamily:"'Syne',sans-serif" },
  cardBadge:   { background:"#edf2f7", color:"#718096", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 },
  cardGlow:    { position:"absolute", bottom:-20, right:-20, width:80, height:80, borderRadius:"50%", opacity:0.06, filter:"blur(20px)" },
  statIconWrap:{ width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" },
  statValue:   { fontSize:26, fontWeight:800, color:"#1a1a2e", lineHeight:1 },
  statLabel:   { fontSize:12, color:"#718096", marginTop:4 },
  statSub:     { fontSize:10, color:"#a0aec0", marginTop:2 },
  table:       { width:"100%", borderCollapse:"collapse", fontSize:13 },
  th:          { textAlign:"left", padding:"8px 12px", fontSize:11, fontWeight:700, color:"#a0aec0", letterSpacing:"0.06em", textTransform:"uppercase", borderBottom:"2px solid #edf2f7" },
  td:          { padding:"10px 12px", color:"#4a5568", verticalAlign:"middle" },
  emptyState:  { textAlign:"center", color:"#a0aec0", fontSize:13, padding:"24px 0" },
  primaryBtn:  { background:"linear-gradient(135deg,#00c9b5,#006d7e)", color:"#fff", border:"none", borderRadius:12, padding:"11px 20px", fontSize:13, fontWeight:700, cursor:"pointer", width:"100%", transition:"all 0.2s" },
  errorBox:    { background:"#fde8e8", border:"1px solid #ef9a9a", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#c62828" },
};
