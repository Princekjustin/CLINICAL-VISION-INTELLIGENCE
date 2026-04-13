import { useState, useRef, useCallback, useEffect } from "react";
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

// ── Constants ──────────────────────────────────────────────────────────────
const API = "http://localhost:8000";

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

      {/* Logo */}
      <div style={s.sidebarLogo}>
        <div style={s.logoIcon}>
          <svg viewBox="0 0 32 32" width={22} height={22}>
            <rect x="12" y="4" width="8" height="24" rx="3" fill="white" opacity="0.95"/>
            <rect x="4" y="12" width="24" height="8" rx="3" fill="white" opacity="0.95"/>
            <line x1="24" y1="8" x2="30" y2="2" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="30" cy="2" r="2" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.3px" }}>CVI</div>
          <div style={{ fontSize: 9, color: "#8892b0", letterSpacing: "0.04em" }}>MONITORING</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map(({ id, icon: Icon, label }) => {
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
        <div style={s.topbarPrimary}>{title}</div>
        <div style={s.topbarSub}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
function UploadPage({ onDetection, threshold }) {
  const [file, setFile]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [annotated, setAnnotated]   = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [highAlert, setHighAlert]   = useState("none");
  const [dragging, setDragging]     = useState(false);

  const handleFile = f => {
    if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f));
    setAnnotated(null); setDetections([]); setError("");
  };

  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type.startsWith("image/") || f.type.startsWith("video/"))) handleFile(f);
  };

  const extractVideoFrame = (videoFile) => new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    video.currentTime = 1;
    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      canvas.toBlob(blob => resolve(blob), "image/jpeg", 0.9);
    };
    video.onerror = reject;
  });

  const detect = async () => {
    if (!file) return;
    setLoading(true); setError("");
    try {
      let imageBlob = file;
      if (file.type.startsWith("video/")) {
        imageBlob = await extractVideoFrame(file);
      }
      const fd = new FormData();
      fd.append("file", imageBlob, "frame.jpg");
      fd.append("confidence_threshold", threshold);
      const res  = await fetch(`${API}/detect`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setAnnotated(`data:image/jpeg;base64,${data.annotated_image}`);
      setDetections(data.detections || []);
      setHighAlert(data.highest_alert || "none");
      if (onDetection) data.detections.forEach(d => onDetection(d, file.type.startsWith("video/") ? "Video Upload" : "Upload"));
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={s.pageWrap}>
      <Topbar title="Upload Analysis" subtitle="Upload an image or video for injection site detection" />
      <AlertBanner level={highAlert} message={
        highAlert === "critical" ? "CRITICAL: Needle angle above 30° — too steep, risk of injury" :
        highAlert === "warning"  ? "WARNING: Needle angle below 15° — too shallow, medication may not reach target tissue" :
        highAlert === "normal"   ? "Needle angle within safe range (15°–30°)" : null
      } />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left — upload */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Drop zone */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardTitle}>Select Image or Video</div>
            </div>
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              style={{
                border: `2px dashed ${dragging ? "#00c9b5" : "#e2e8f0"}`,
                borderRadius: 14, padding: "28px 20px",
                textAlign: "center", cursor: "pointer",
                background: dragging ? "rgba(0,201,181,0.05)" : "#fafafa",
                transition: "all 0.2s"
              }}
              onClick={() => document.getElementById("file-input").click()}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{file && file.type.startsWith("video/") ? "🎬" : "🖼️"}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#4a5568", marginBottom: 4 }}>
                {file ? file.name : "Click or drag & drop an image or video"}
              </div>
              <div style={{ fontSize: 11, color: "#a0aec0" }}>JPG, PNG, MP4, MOV supported</div>
              <input id="file-input" type="file" accept="image/*,video/*" style={{ display: "none" }}
                onChange={e => handleFile(e.target.files[0])} />
            </div>

            {preview && file && file.type.startsWith("video/") ? (
              <video src={preview} controls style={{ width: "100%", borderRadius: 12, marginTop: 12, maxHeight: 220, background: "#0a0a0a" }} />
            ) : preview ? (
              <img src={preview} alt="Preview" style={{ width: "100%", borderRadius: 12, marginTop: 12, maxHeight: 220, objectFit: "contain", background: "#f7fafc" }} />
            ) : null}

            {error && <div style={{ ...s.errorBox, marginTop: 10 }}>⚠ {error}</div>}

            <button
              onClick={detect} disabled={!file || loading}
              style={{ ...s.primaryBtn, marginTop: 14, opacity: (!file || loading) ? 0.6 : 1 }}
            >
              {loading ? "⏳ Analysing..." : "🔍 Run Detection"}
            </button>
          </div>
        </div>

        {/* Right — results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {annotated && (
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.cardTitle}>Detection Result</div>
                <div style={{ ...s.cardBadge, background: "#e8f5e9", color: "#2e7d32" }}>
                  {detections.length} objects
                </div>
              </div>
              <img src={annotated} alt="Result" style={{ width: "100%", borderRadius: 12, maxHeight: 240, objectFit: "contain", background: "#f7fafc" }} />
            </div>
          )}

          {detections.length > 0 && (
            <div style={s.card}>
              <div style={s.cardHeader}>
                <div style={s.cardTitle}>Confidence Scores</div>
              </div>
              {detections.map((d, i) => {
                const cat = CATS.find(c => c.label === d.category);
                return <ConfBar key={i} label={d.category} confidence={d.confidence} color={cat?.color || "#00c9b5"} />;
              })}
            </div>
          )}

          {!annotated && (
            <div style={{ ...s.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
              <div style={s.emptyState}>Upload an image and run detection to see results here</div>
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
function CameraPage({ onDetection, threshold }) {
  const [active, setActive]       = useState(false);
  const [annotated, setAnnotated] = useState(null);
  const [liveDets, setLiveDets]   = useState([]);
  const [liveAlert, setLiveAlert] = useState("none");
  const [error, setError]         = useState("");
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const intervalRef = useRef(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setActive(true);
      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const cv = canvasRef.current;
        cv.width = videoRef.current.videoWidth; cv.height = videoRef.current.videoHeight;
        const ctx2d = cv.getContext("2d");
        // Flip horizontally to correct mirror effect before sending to API
        ctx2d.translate(cv.width, 0);
        ctx2d.scale(-1, 1);
        ctx2d.drawImage(videoRef.current, 0, 0);
        ctx2d.setTransform(1, 0, 0, 1, 0, 0);
        cv.toBlob(async blob => {
          if (!blob) return;
          const fd = new FormData(); fd.append("file", blob, "frame.jpg");
          fd.append("confidence_threshold", threshold);
          try {
            const res = await fetch(`${API}/detect`, { method: "POST", body: fd });
            const data = await res.json();
            setAnnotated(`data:image/jpeg;base64,${data.annotated_image}`);
            setLiveDets(data.detections || []);
            setLiveAlert(data.highest_alert || "none");
            if (onDetection) data.detections.forEach(d => onDetection(d, "Live Camera"));
          } catch (_) {}
        }, "image/jpeg", 0.8);
      }, 800);
    } catch (e) { setError("Camera access denied. Please allow camera permissions."); }
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    setActive(false); setLiveDets([]); setAnnotated(null); setLiveAlert("none");
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div style={s.pageWrap}>
      <Topbar title="Live Camera" subtitle="Real-time injection site monitoring via webcam" />
      <AlertBanner level={liveAlert} message={
        liveAlert === "critical" ? "CRITICAL: Needle angle above 30° — too steep" :
        liveAlert === "warning"  ? "WARNING: Needle angle below 15° — too shallow" :
        liveAlert === "normal"   ? "Needle angle within safe range (15°–30°)" : null
      } />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.cardTitle}>Camera Feed</div>
              <div style={{
                ...s.cardBadge,
                background: active ? "#e8f5e9" : "#f5f5f5",
                color: active ? "#2e7d32" : "#616161"
              }}>
                {active ? "● LIVE" : "○ OFF"}
              </div>
            </div>
            <div style={{ background: "#0a0a0a", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <video ref={videoRef} style={{ width: "100%", display: "block" }} muted />
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
          {annotated && (
            <div style={s.card}>
              <div style={s.cardHeader}><div style={s.cardTitle}>Live Detection</div></div>
              <img src={annotated} alt="Live" style={{ width: "100%", borderRadius: 12, maxHeight: 220, objectFit: "contain", background: "#f7fafc" }} />
            </div>
          )}
          {liveDets.length > 0 && (
            <div style={s.card}>
              <div style={s.cardHeader}><div style={s.cardTitle}>Live Confidence</div></div>
              {liveDets.map((d, i) => {
                const cat = CATS.find(c => c.label === d.category);
                return <ConfBar key={i} label={d.category} confidence={d.confidence} color={cat?.color || "#00c9b5"} />;
              })}
            </div>
          )}
          {!annotated && (
            <div style={{ ...s.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 220 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📷</div>
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
            <input type="range" min={0.3} max={0.95} step={0.05} value={threshold}
              onChange={e => setThreshold(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#00c9b5" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#a0aec0", marginTop: 4 }}>
              <span>30% (Sensitive)</span><span>95% (Strict)</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#718096" }}>
              Higher threshold = fewer but more confident detections. Recommended: 50–75% for clinical use.
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
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
export default function Dashboard({ user, onLogout }) {
  const [log, setLog] = useState(() => {
    try {
      const saved = localStorage.getItem("cvi_session_log");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [threshold, setThreshold] = useState(0.5);

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f4f8; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f0f4f8; }
        ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 99px; }
      `}</style>

      <Sidebar user={user} onLogout={onLogout} />

      <main style={s.main}>
        <Routes>
          <Route path="home"     element={<HomePage log={log} />} />
          <Route path="upload"   element={<UploadPage onDetection={addDetection} threshold={threshold} />} />
          <Route path="camera"   element={<CameraPage onDetection={addDetection} threshold={threshold} />} />
          <Route path="log"      element={<AuditPage log={log} onClear={clearLog} />} />
          <Route path="settings" element={<SettingsPage threshold={threshold} setThreshold={setThreshold} />} />
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
  cardTitle:   { fontSize:14, fontWeight:800, color:"#1a1a2e" },
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
