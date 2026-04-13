import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = ["Physician", "Nurse Practitioner", "Radiologist", "Admin"];
const DEPARTMENTS = [
  "Emergency Medicine",
  "Intensive Care Unit",
  "General Surgery",
  "Oncology",
  "Radiology",
  "Paediatrics",
  "Cardiology",
  "Other",
];

export default function Register({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    staffId: "",
    email: "",
    department: DEPARTMENTS[0],
    role: ROLES[0],
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [focused, setFocused]         = useState(null);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    if (!form.fullName.trim())       return "Full name is required.";
    if (!form.staffId.trim())        return "Staff ID is required.";
    if (!form.email.includes("@"))   return "Valid email is required.";
    if (form.password.length < 6)    return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    if (onRegister) onRegister({ username: form.fullName, role: form.role });
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030d12; }

        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes spin   { to{transform:rotate(360deg)} }

        .reg-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #1a3a45;
          color: #e0f0f5;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          padding: 8px 0 6px;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.04em;
        }
        .reg-input::placeholder { color: #2a5060; }
        .reg-input:focus { border-bottom-color: #00b4d8; }
        .reg-input:-webkit-autofill,
        .reg-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #030d12 inset !important;
          -webkit-text-fill-color: #e0f0f5 !important;
        }

        .reg-select {
          width: 100%;
          background: #060f14;
          border: 1px solid #1a3a45;
          color: #7ab8c8;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          padding: 8px 10px;
          outline: none;
          cursor: pointer;
          appearance: none;
          letter-spacing: 0.06em;
        }
        .reg-select:focus { border-color: #00b4d8; }

        .reg-btn {
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
        .reg-btn:hover:not(:disabled) { background: #0096c7; }
        .reg-btn:active:not(:disabled) { transform: scale(0.99); }
        .reg-btn:disabled { background: #0d3040; color: #1a5060; cursor: not-allowed; }

        .reg-field { animation: fadeUp 0.4s ease both; }
        .reg-field:nth-child(1) { animation-delay: 0.1s; }
        .reg-field:nth-child(2) { animation-delay: 0.17s; }
        .reg-field:nth-child(3) { animation-delay: 0.24s; }
        .reg-field:nth-child(4) { animation-delay: 0.31s; }
        .reg-field:nth-child(5) { animation-delay: 0.38s; }
        .reg-field:nth-child(6) { animation-delay: 0.45s; }
        .reg-field:nth-child(7) { animation-delay: 0.52s; }
        .reg-field:nth-child(8) { animation-delay: 0.59s; }
      `}</style>

      {/* LEFT PANEL */}
      <div style={styles.left}>
        <div style={styles.gridLines} />

        {/* Top tag */}
        <div style={styles.sysTag}>
          <span style={styles.dot} />
          SECURE CLINICAL TERMINAL  v2.1.0
        </div>

        {/* Centre */}
        <div style={styles.leftCenter}>
          {/* Crosshair */}
          <div style={styles.crosshair}>
            <div style={styles.chH} />
            <div style={styles.chV} />
            <div style={styles.chCircle} />
          </div>

          <div style={{ marginBottom: 40 }}>
            <div style={styles.eyebrow}>NEW PERSONNEL REGISTRATION</div>
            <div style={styles.brandTitle}>Clinical<br />Vision<br />Intelligence</div>
            <div style={styles.brandSub}>
              YOLOv11  ·  MONAI  ·  RTX 5070<br />
              Needle Angle Detection  ·  16,368 training images
            </div>
          </div>

          {/* Info strip */}
          <div style={styles.infoStrip}>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>SYSTEM</div>
              <div style={styles.infoVal}>ONLINE</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>SECURITY</div>
              <div style={styles.infoVal}>ACTIVE</div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>VERSION</div>
              <div style={styles.infoVal}>2.1.0</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={styles.leftBottom}>
          <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: "#1a5060" }}>
            {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, color: "#00b4d8", letterSpacing: "0.1em" }}>
            {new Date().toLocaleTimeString("en-GB", { hour12: false })}
          </span>
        </div>
      </div>

      {/* RIGHT PANEL — Registration form */}
      <div style={styles.right}>
        {/* Corner accents */}
        <div style={{ ...styles.corner, top: 24, right: 24, borderTop: "1px solid #1a3a45", borderRight: "1px solid #1a3a45" }} />
        <div style={{ ...styles.corner, bottom: 24, left: 24, borderBottom: "1px solid #1a3a45", borderLeft: "1px solid #1a3a45" }} />

        <div style={styles.formWrap}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={styles.formEyebrow}>
              <span style={styles.eyebrowDash} />
              REGISTER
            </div>
            <div style={styles.formTitle}>New Account</div>
            <div style={styles.formSub}>
              Complete all fields to create your clinical access profile.
            </div>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Row 1 — Full Name + Staff ID */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="reg-field">
                  <div style={styles.label}>FULL NAME</div>
                  <input className="reg-input" type="text" placeholder="Dr. Jane Smith"
                    value={form.fullName} onChange={update("fullName")}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                  {focused === "name" && <div style={styles.cursor} />}
                </div>
                <div className="reg-field">
                  <div style={styles.label}>STAFF ID</div>
                  <input className="reg-input" type="text" placeholder="STF-00421"
                    value={form.staffId} onChange={update("staffId")}
                    onFocus={() => setFocused("staff")} onBlur={() => setFocused(null)} />
                </div>
              </div>

              {/* Email */}
              <div className="reg-field">
                <div style={styles.label}>EMAIL ADDRESS</div>
                <input className="reg-input" type="email" placeholder="jane.smith@hospital.org"
                  value={form.email} onChange={update("email")}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
              </div>

              {/* Row 2 — Department + Role */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="reg-field">
                  <div style={styles.label}>DEPARTMENT</div>
                  <div style={{ position: "relative" }}>
                    <select className="reg-select" value={form.department} onChange={update("department")}>
                      {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    <span style={styles.arrow}>▾</span>
                  </div>
                </div>
                <div className="reg-field">
                  <div style={styles.label}>CLINICAL ROLE</div>
                  <div style={{ position: "relative" }}>
                    <select className="reg-select" value={form.role} onChange={update("role")}>
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                    <span style={styles.arrow}>▾</span>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="reg-field">
                <div style={styles.label}>PASSWORD</div>
                <div style={{ position: "relative" }}>
                  <input className="reg-input" type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password} onChange={update("password")}
                    onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)}
                    style={{ paddingRight: 32 }} />
                  <button type="button" onClick={() => setShowPass((p) => !p)} style={styles.eye}>
                    {showPass ? "○" : "●"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="reg-field">
                <div style={styles.label}>CONFIRM PASSWORD</div>
                <div style={{ position: "relative" }}>
                  <input className="reg-input" type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirmPassword} onChange={update("confirmPassword")}
                    onFocus={() => setFocused("confirm")} onBlur={() => setFocused(null)}
                    style={{ paddingRight: 32 }} />
                  <button type="button" onClick={() => setShowConfirm((p) => !p)} style={styles.eye}>
                    {showConfirm ? "○" : "●"}
                  </button>
                  {/* Password match indicator */}
                  {form.confirmPassword && (
                    <span style={{
                      position: "absolute", right: 28, top: "50%",
                      transform: "translateY(-50%)", fontSize: 10,
                      color: form.password === form.confirmPassword ? "#00e676" : "#ff5252"
                    }}>
                      {form.password === form.confirmPassword ? "✓" : "✗"}
                    </span>
                  )}
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
              <div className="reg-field">
                <button className="reg-btn" type="submit" disabled={loading}>
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
                      CREATING ACCOUNT...
                    </span>
                  ) : "CREATE CLINICAL ACCOUNT →"}
                </button>
              </div>

              {/* Login link */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 10, color: "#1a5060", fontFamily: "'IBM Plex Mono'" }}>
                  Already have an account?{" "}
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    background: "none", border: "none", color: "#00b4d8",
                    fontSize: 10, fontFamily: "'IBM Plex Mono'",
                    cursor: "pointer", letterSpacing: "0.06em",
                    textDecoration: "underline"
                  }}
                >
                  Login here
                </button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div style={styles.footer}>
            <span style={{ color: "#00e676", marginRight: 6, animation: "pulse 2s ease infinite", display: "inline-block" }}>■</span>
            System operational  ·  All registrations are logged and verified
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: "flex", width: "100vw", height: "100vh",
    background: "#030d12", overflow: "hidden",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  left: {
    position: "relative", width: "42%",
    background: "#04111a", borderRight: "1px solid #0d2a35",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    overflow: "hidden",
  },
  gridLines: {
    position: "absolute", inset: 0,
    backgroundImage: `linear-gradient(rgba(0,180,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.04) 1px, transparent 1px)`,
    backgroundSize: "48px 48px", pointerEvents: "none",
  },
  sysTag: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "18px 28px", fontSize: 9, color: "#1a5060",
    letterSpacing: "0.15em", borderBottom: "1px solid #0a2030",
    position: "relative", zIndex: 2,
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#00b4d8", boxShadow: "0 0 8px #00b4d8",
    animation: "pulse 2s ease infinite", display: "inline-block",
  },
  leftCenter: {
    flex: 1, display: "flex", flexDirection: "column",
    justifyContent: "center", padding: "0 48px",
    position: "relative", zIndex: 2,
  },
  crosshair: { position: "relative", width: 40, height: 40, marginBottom: 32 },
  chH: { position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(0,180,216,0.4)", transform: "translateY(-50%)" },
  chV: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(0,180,216,0.4)", transform: "translateX(-50%)" },
  chCircle: { position: "absolute", inset: 8, borderRadius: "50%", border: "1px solid rgba(0,180,216,0.5)" },
  eyebrow: { fontSize: 8, color: "#00b4d8", letterSpacing: "0.2em", marginBottom: 14 },
  brandTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 46,
    fontWeight: 800, color: "#e0f0f5", lineHeight: 1.0,
    letterSpacing: "-0.02em", marginBottom: 18,
  },
  brandSub: { fontSize: 9, color: "#2a6070", lineHeight: 1.8, letterSpacing: "0.06em" },
  infoStrip: { display: "flex", gap: 0, borderTop: "1px solid #0a2030", paddingTop: 18 },
  infoItem: { flex: 1 },
  infoLabel: { fontSize: 7, color: "#1a4050", letterSpacing: "0.15em", marginBottom: 4 },
  infoVal: { fontSize: 11, fontWeight: 500, color: "#00e676", letterSpacing: "0.08em", animation: "pulse 2s ease infinite" },
  leftBottom: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 28px", borderTop: "1px solid #0a2030",
    position: "relative", zIndex: 2,
  },
  right: {
    flex: 1, display: "flex", alignItems: "center",
    justifyContent: "center", background: "#030d12", position: "relative",
    overflowY: "auto",
  },
  corner: { position: "absolute", width: 20, height: 20 },
  formWrap: {
    width: "100%", maxWidth: 420, padding: "24px",
    animation: "fadeUp 0.5s ease both",
  },
  formEyebrow: {
    display: "flex", alignItems: "center", gap: 10,
    fontSize: 9, color: "#00b4d8", letterSpacing: "0.2em", marginBottom: 8,
  },
  eyebrowDash: { display: "inline-block", width: 20, height: 1, background: "#00b4d8" },
  formTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: 30,
    fontWeight: 700, color: "#e0f0f5", letterSpacing: "-0.02em", marginBottom: 8,
  },
  formSub: { fontSize: 10, color: "#2a5060", lineHeight: 1.7, letterSpacing: "0.04em" },
  label: { fontSize: 7, color: "#1a5060", letterSpacing: "0.2em", marginBottom: 6 },
  cursor: {
    width: 2, height: 12, background: "#00b4d8",
    animation: "blink 1s step-end infinite", marginTop: 2,
  },
  arrow: {
    position: "absolute", right: 10, top: "50%",
    transform: "translateY(-50%)", color: "#1a5060",
    fontSize: 12, pointerEvents: "none",
  },
  eye: {
    position: "absolute", right: 0, top: "50%",
    transform: "translateY(-50%)", background: "none",
    border: "none", color: "#1a5060", cursor: "pointer",
    fontSize: 12, padding: 0, lineHeight: 1,
  },
  errorBox: {
    fontSize: 11, color: "#ff5252",
    background: "rgba(255,82,82,0.06)",
    border: "1px solid rgba(255,82,82,0.2)",
    padding: "8px 12px", letterSpacing: "0.04em",
    animation: "fadeUp 0.2s ease",
  },
  footer: {
    marginTop: 20, fontSize: 9, color: "#1a4050",
    letterSpacing: "0.08em", display: "flex", alignItems: "center",
  },
};
