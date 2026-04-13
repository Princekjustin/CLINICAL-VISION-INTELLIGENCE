import { useState, useEffect } from "react";

const ROLES = ["Physician", "Nurse Practitioner", "Radiologist", "Admin"];

export default function Login({ onLogin }) {
  const [username, setUsername]     = useState("");
  const [password, setPassword]     = useState("");
  const [role, setRole]             = useState(ROLES[0]);
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [tick, setTick]             = useState(new Date());
  const [scanY, setScanY]           = useState(0);
  const [focused, setFocused]       = useState(null);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Scanline animation
  useEffect(() => {
    let y = 0;
    const id = setInterval(() => {
      y = (y + 1) % 100;
      setScanY(y);
    }, 18);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setError("Username is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    if (onLogin) onLogin({ username, role });
  };

  const timeStr = tick.toLocaleTimeString("en-GB", { hour12: false });
  const dateStr = tick.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={styles.root}>
      {/* Global styles injected inline */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030d12; }

        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes gridIn { from{opacity:0} to{opacity:1} }

        .cvi-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #1a3a45;
          color: #e0f0f5;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          padding: 10px 0 8px;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.04em;
        }
        .cvi-input::placeholder { color: #2a5060; }
        .cvi-input:focus { border-bottom-color: #00b4d8; }

        .cvi-input:-webkit-autofill,
        .cvi-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #030d12 inset !important;
          -webkit-text-fill-color: #e0f0f5 !important;
        }

        .cvi-select {
          width: 100%;
          background: #060f14;
          border: 1px solid #1a3a45;
          color: #7ab8c8;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          padding: 9px 10px;
          outline: none;
          cursor: pointer;
          appearance: none;
          letter-spacing: 0.06em;
        }
        .cvi-select:focus { border-color: #00b4d8; }

        .cvi-btn {
          width: 100%;
          background: #00b4d8;
          color: #030d12;
          border: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          padding: 13px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          text-transform: uppercase;
        }
        .cvi-btn:hover:not(:disabled) { background: #0096c7; }
        .cvi-btn:active:not(:disabled) { transform: scale(0.99); }
        .cvi-btn:disabled { background: #0d3040; color: #1a5060; cursor: not-allowed; }

        .cvi-field-wrap { animation: fadeUp 0.4s ease both; }
        .cvi-field-wrap:nth-child(1) { animation-delay: 0.15s; }
        .cvi-field-wrap:nth-child(2) { animation-delay: 0.25s; }
        .cvi-field-wrap:nth-child(3) { animation-delay: 0.35s; }
        .cvi-field-wrap:nth-child(4) { animation-delay: 0.45s; }
      `}</style>

      {/* Left panel — system identity */}
      <div style={styles.left}>

        {/* Scanline overlay */}
        <div style={{ ...styles.scanline, top: `${scanY}%` }} />

        {/* Grid lines */}
        <div style={styles.gridLines} />

        {/* Top-left system tag */}
        <div style={styles.sysTag}>
          <span style={styles.sysTagDot} />
          SECURE CLINICAL TERMINAL  v2.1.0
        </div>

        {/* Centre content */}
        <div style={styles.leftCenter}>
          <div style={styles.crosshair}>
            <div style={styles.chH} />
            <div style={styles.chV} />
            <div style={styles.chCircle} />
          </div>

          <div style={styles.brandBlock}>
            <div style={styles.brandEyebrow}>AUTOMATED MONITORING SYSTEM</div>
            <div style={styles.brandTitle}>Clinical<br />Vision<br />Intelligence</div>
            <div style={styles.brandSub}>
              YOLOv11  ·  MONAI  ·  RTX 5070<br />
              Needle Angle Detection  ·  16,368 training images
            </div>
          </div>

          {/* Live stats strip */}
          <div style={styles.statsStrip}>
            {[
              { label: "MODEL",   val: "YOLOv11n" },
              { label: "DATASET", val: "16,368" },
              { label: "CLASSES", val: "18" },
              { label: "STATUS",  val: "ONLINE", blink: true },
            ].map((st, i) => (
              <div key={i} style={styles.statItem}>
                <div style={styles.statLabel}>{st.label}</div>
                <div style={{
                  ...styles.statVal,
                  color: st.blink ? "#00e676" : "#00b4d8",
                  animation: st.blink ? "pulse 2s ease infinite" : "none"
                }}>{st.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={styles.leftBottom}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#1a5060" }}>
            {dateStr}
          </span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
            color: "#00b4d8", letterSpacing: "0.1em"
          }}>
            {timeStr}
          </span>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={styles.right}>

        {/* Corner decorations */}
        <div style={{ ...styles.corner, top: 24, right: 24, borderTop: "1px solid #1a3a45", borderRight: "1px solid #1a3a45" }} />
        <div style={{ ...styles.corner, bottom: 24, left: 24, borderBottom: "1px solid #1a3a45", borderLeft: "1px solid #1a3a45" }} />

        <div style={styles.formWrap}>

          {/* Form header */}
          <div style={{ marginBottom: 40 }}>
            <div style={styles.formEyebrow}>
              <span style={styles.formEyebrowDash} />
              AUTHENTICATE
            </div>
            <div style={styles.formTitle}>Access Portal</div>
            <div style={styles.formSub}>
              Authorised personnel only.<br />
              All sessions are logged and monitored.
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

              {/* Username */}
              <div className="cvi-field-wrap">
                <div style={styles.fieldLabel}>USER ID</div>
                <div style={{ position: "relative" }}>
                  <input
                    className="cvi-input"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onFocus={() => setFocused("user")}
                    onBlur={() => setFocused(null)}
                    autoComplete="off"
                  />
                  {focused === "user" && <div style={styles.inputCursor} />}
                </div>
              </div>

              {/* Password */}
              <div className="cvi-field-wrap">
                <div style={styles.fieldLabel}>PASSPHRASE</div>
                <div style={{ position: "relative" }}>
                  <input
                    className="cvi-input"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    autoComplete="new-password"
                    style={{ paddingRight: 32 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    style={styles.eyeBtn}
                    tabIndex={-1}
                  >
                    {showPass ? "○" : "●"}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="cvi-field-wrap">
                <div style={styles.fieldLabel}>CLINICAL ROLE</div>
                <div style={{ position: "relative" }}>
                  <select
                    className="cvi-select"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <span style={styles.selectArrow}>▾</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={styles.errorBox}>
                  <span style={{ color: "#ff5252", marginRight: 6 }}>!</span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="cvi-field-wrap" style={{ marginTop: 4 }}>
                <button className="cvi-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <span style={{
                        width: 12, height: 12,
                        border: "2px solid #0d3040",
                        borderTop: "2px solid #030d12",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite"
                      }} />
                      AUTHENTICATING...
                    </span>
                  ) : "AUTHORISE ACCESS →"}
                </button>
              </div>
            </div>
          </form>

          {/* Footer note */}
          <div style={styles.formFooter}>
            <span style={{ color: "#00e676", marginRight: 6, animation: "pulse 2s ease infinite", display: "inline-block" }}>■</span>
            System operational  ·  MONAI pipeline active  ·  YOLOv11 loaded
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    background: "#030d12",
    overflow: "hidden",
    fontFamily: "'IBM Plex Mono', monospace",
  },

  // Left panel
  left: {
    position: "relative",
    width: "48%",
    background: "#04111a",
    borderRight: "1px solid #0d2a35",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  scanline: {
    position: "absolute",
    left: 0, right: 0,
    height: 2,
    background: "rgba(0,180,216,0.06)",
    pointerEvents: "none",
    zIndex: 1,
    transition: "top 0.018s linear",
  },
  gridLines: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  sysTag: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "20px 28px",
    fontSize: 9,
    color: "#1a5060",
    letterSpacing: "0.15em",
    borderBottom: "1px solid #0a2030",
    position: "relative", zIndex: 2,
  },
  sysTagDot: {
    width: 6, height: 6,
    borderRadius: "50%",
    background: "#00b4d8",
    boxShadow: "0 0 8px #00b4d8",
    animation: "pulse 2s ease infinite",
    display: "inline-block",
  },
  leftCenter: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 52px",
    position: "relative", zIndex: 2,
  },
  crosshair: {
    position: "relative",
    width: 40, height: 40,
    marginBottom: 36,
  },
  chH: {
    position: "absolute",
    top: "50%", left: 0, right: 0,
    height: 1,
    background: "rgba(0,180,216,0.4)",
    transform: "translateY(-50%)",
  },
  chV: {
    position: "absolute",
    left: "50%", top: 0, bottom: 0,
    width: 1,
    background: "rgba(0,180,216,0.4)",
    transform: "translateX(-50%)",
  },
  chCircle: {
    position: "absolute",
    inset: 8,
    borderRadius: "50%",
    border: "1px solid rgba(0,180,216,0.5)",
  },
  brandBlock: {
    marginBottom: 48,
  },
  brandEyebrow: {
    fontSize: 9,
    color: "#00b4d8",
    letterSpacing: "0.2em",
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 52,
    fontWeight: 800,
    color: "#e0f0f5",
    lineHeight: 1.0,
    letterSpacing: "-0.02em",
    marginBottom: 20,
  },
  brandSub: {
    fontSize: 10,
    color: "#2a6070",
    lineHeight: 1.8,
    letterSpacing: "0.06em",
  },
  statsStrip: {
    display: "flex",
    gap: 0,
    borderTop: "1px solid #0a2030",
    paddingTop: 20,
  },
  statItem: {
    flex: 1,
    paddingRight: 16,
  },
  statLabel: {
    fontSize: 8,
    color: "#1a4050",
    letterSpacing: "0.15em",
    marginBottom: 5,
  },
  statVal: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.08em",
  },
  leftBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    borderTop: "1px solid #0a2030",
    position: "relative", zIndex: 2,
  },

  // Right panel
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#030d12",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 20, height: 20,
  },
  formWrap: {
    width: "100%",
    maxWidth: 360,
    padding: "0 24px",
    animation: "fadeUp 0.5s ease both",
  },
  formEyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 9,
    color: "#00b4d8",
    letterSpacing: "0.2em",
    marginBottom: 10,
  },
  formEyebrowDash: {
    display: "inline-block",
    width: 20,
    height: 1,
    background: "#00b4d8",
  },
  formTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 700,
    color: "#e0f0f5",
    letterSpacing: "-0.02em",
    marginBottom: 10,
  },
  formSub: {
    fontSize: 10,
    color: "#2a5060",
    lineHeight: 1.7,
    letterSpacing: "0.04em",
  },
  fieldLabel: {
    fontSize: 8,
    color: "#1a5060",
    letterSpacing: "0.2em",
    marginBottom: 8,
  },
  inputCursor: {
    position: "absolute",
    right: 0, bottom: 8,
    width: 2, height: 14,
    background: "#00b4d8",
    animation: "blink 1s step-end infinite",
  },
  eyeBtn: {
    position: "absolute",
    right: 0, top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#1a5060",
    cursor: "pointer",
    fontSize: 12,
    padding: 0,
    lineHeight: 1,
  },
  selectArrow: {
    position: "absolute",
    right: 10, top: "50%",
    transform: "translateY(-50%)",
    color: "#1a5060",
    fontSize: 12,
    pointerEvents: "none",
  },
  errorBox: {
    fontSize: 11,
    color: "#ff5252",
    background: "rgba(255,82,82,0.06)",
    border: "1px solid rgba(255,82,82,0.2)",
    padding: "8px 12px",
    letterSpacing: "0.04em",
    animation: "fadeUp 0.2s ease",
  },
  formFooter: {
    marginTop: 32,
    fontSize: 9,
    color: "#1a4050",
    letterSpacing: "0.08em",
    display: "flex",
    alignItems: "center",
  },
};
