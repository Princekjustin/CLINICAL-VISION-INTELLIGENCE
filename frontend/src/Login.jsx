import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = ["Physician", "Nurse Practitioner", "Radiologist", "Admin"];

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState(ROLES[0]);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [tick, setTick]         = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setError("Username is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    let accounts = [];
    try {
      const raw = localStorage.getItem("cvi_registered_accounts");
      accounts = raw ? JSON.parse(raw) : [];
    } catch { accounts = []; }

    const account = accounts.find(a =>
      a.fullName.toLowerCase() === username.trim().toLowerCase() ||
      a.staffId.toLowerCase() === username.trim().toLowerCase()
    );

    if (!account) {
      setLoading(false);
      setError("Account not found. Please register first.");
      return;
    }

    try {
      let inputHash = "";
      if (window.crypto && crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        inputHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      } else {
        inputHash = btoa(password);
      }

      if (inputHash !== account.passwordHash && btoa(password) !== account.passwordHash) {
        setLoading(false);
        setError("Incorrect password. Please try again.");
        return;
      }
    } catch {
      setLoading(false);
      setError("Authentication error. Please try again.");
      return;
    }

    setLoading(false);
    if (onLogin) onLogin({ username: account.fullName, role: account.role, staffId: account.staffId });
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        
        .cvi-field {
          width:100%; background:rgba(255,255,255,0.15); border:1.5px solid rgba(255,255,255,0.4);
          border-radius:12px; color:#ffffff !important; font-family:'Nunito',sans-serif; font-size:14px;
          padding:13px 16px 13px 44px; outline:none; transition:all 0.2s;
          backdrop-filter:blur(4px);
        }
        
        /* Pure White Placeholders */
        .cvi-field::placeholder { color: rgba(255,255,255,0.7) !important; opacity: 1; }

        /* Powerful Autofill Fix: Keeps text pure white */
        .cvi-field:-webkit-autofill,
        .cvi-field:-webkit-autofill:hover, 
        .cvi-field:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px rgba(0, 109, 126, 0.4) inset !important;
          caret-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .cvi-select {
          width:100%; background:rgba(255,255,255,0.15); border:1.5px solid rgba(255,255,255,0.4);
          border-radius:12px; color:#ffffff !important; font-family:'Nunito',sans-serif; font-size:14px;
          padding:13px 16px 13px 44px; outline:none; cursor:pointer; appearance:none;
        }
        .cvi-select option { background:#0a7a8a; color:#fff; }
        
        .login-btn {
          width:100%; background:#fff; color:#0a7a8a; border:none; border-radius:12px;
          padding:14px; font-weight:800; cursor:pointer; transition:all 0.2s;
          font-family:'Nunito',sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .login-btn:hover:not(:disabled) { background:#e0f7fa; transform:translateY(-1px); }
        .field-wrap { animation:fadeUp 0.5s ease both; }
        .ecg-path { stroke-dasharray:1000; stroke-dashoffset:1000; animation:ecg 3s ease forwards 0.5s; }
        @keyframes ecg { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
      `}</style>

      {/* Blobs */}
      <div style={styles.blob1} /><div style={styles.blob2} /><div style={styles.blob3} />

      <div style={styles.topBar}>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>System Online · MONAI Active · YOLOv11 Ready</span>
        </div>
        <span style={styles.clockText}>
          {tick.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})} · {tick.toLocaleTimeString("en-GB",{hour12:false})}
        </span>
      </div>

      <div style={styles.card}>
        <div style={{display:"flex", justifyContent:"center", marginBottom:16, animation:"fadeUp 0.5s ease both 0.05s"}}>
          <svg viewBox="0 0 48 48" width={52} height={52}>
            <rect x="18" y="6" width="12" height="36" rx="5" fill="white" opacity="0.9"/>
            <rect x="6" y="18" width="36" height="12" rx="5" fill="white" opacity="0.9"/>
            <line x1="37" y1="11" x2="44" y2="4" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="44" cy="4" r="2.5" fill="rgba(255,255,255,0.8)"/>
          </svg>
        </div>

        <div style={{textAlign:"center", marginBottom:28, animation:"fadeUp 0.5s ease both 0.1s"}}>
          <div style={styles.cardTitle}>Welcome Back</div>
          <div style={styles.cardSub}>Clinical Vision Intelligence</div>
          <div style={styles.cardSubSmall}>Automated Injection Monitoring System</div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{display:"flex", flexDirection:"column", gap:14}}>
            <div className="field-wrap" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={2}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
              <input className="cvi-field" placeholder="Username or Staff ID" value={username} onChange={e => setUsername(e.target.value)} />
            </div>

            <div className="field-wrap" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={2}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
              </div>
              <input className="cvi-field" type={showPass?"text":"password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>{showPass?"Hide":"Show"}</button>
            </div>

            <div className="field-wrap" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </div>
              <select className="cvi-select" value={role} onChange={e => setRole(e.target.value)}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {error && <div style={styles.errorBox}>⚠ {error}</div>}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>

            <div style={{textAlign:"center", marginTop:16}}>
               <button type="button" onClick={() => { if(window.confirm("Clear all data?")) { localStorage.clear(); window.location.reload(); } }} 
                 style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:11,cursor:"pointer",textDecoration:"underline",marginBottom:12,display:"block",width:"100%"}}>
                 Trouble logging in? Clear System Data
               </button>
              <span style={{fontSize:12, color:"rgba(255,255,255,0.7)"}}>Don't have an account? </span>
              <button type="button" onClick={() => navigate("/register?force=1")} style={styles.link}>Register here</button>
            </div>
          </div>
        </form>

        <div style={styles.cardFooter}>
          <span style={styles.footerDot}/>
          Authorised personnel only · All sessions are logged
        </div>
      </div>

      <div style={styles.ecgWrap}>
        <svg viewBox="0 0 800 60" style={{width:"100%", height:60}}>
          <path className="ecg-path" d="M0,30 L80,30 L100,30 L115,5 L130,55 L145,5 L160,30 L200,30 L800,30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
        </svg>
      </div>
    </div>
  );
}

const styles = {
  root:{position:"relative",width:"100vw",height:"100vh",background:"linear-gradient(135deg,#006d7e 0%,#00a3b5 40%,#00c9b5 100%)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontFamily:"'Nunito',sans-serif"},
  blob1:{position:"absolute",top:"-15%",left:"-10%",width:480,height:480,borderRadius:"50%",background:"rgba(255,255,255,0.08)"},
  blob2:{position:"absolute",bottom:"-20%",right:"-8%",width:560,height:560,borderRadius:"50%",background:"rgba(255,255,255,0.06)"},
  blob3:{position:"absolute",top:"30%",left:"20%",width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.04)"},
  ecgWrap:{position:"absolute",bottom:0,left:0,right:0,opacity:0.6},
  topBar:{position:"absolute",top:0,left:0,right:0,padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(0,0,0,0.1)",backdropFilter:"blur(4px)"},
  statusDot:{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#7fffb2",animation:"pulse 2s ease infinite"},
  statusText:{fontSize:11,color:"rgba(255,255,255,0.75)"},
  clockText:{fontSize:12,color:"rgba(255,255,255,0.75)",fontWeight:600},
  card:{position:"relative",zIndex:10,background:"rgba(255,255,255,0.12)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.25)",borderRadius:24,padding:"36px 40px",width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"},
  cardTitle:{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"#fff",marginBottom:4},
  cardSub:{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)"},
  cardSubSmall:{fontSize:11,color:"rgba(255,255,255,0.6)"},
  fieldIcon:{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",zIndex:1},
  eyeBtn:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.6)",fontSize:11},
  errorBox:{background:"rgba(255,80,80,0.2)",border:"1px solid rgba(255,80,80,0.4)",borderRadius:10,padding:"10px",fontSize:12,color:"#ffb3b3",textAlign:"center"},
  link:{background:"none",border:"none",color:"#fff",cursor:"pointer",textDecoration:"underline",fontSize:12,fontWeight:700},
  cardFooter:{marginTop:20,fontSize:10,color:"rgba(255,255,255,0.55)",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:6},
  footerDot:{display:"inline-block",width:6,height:6,borderRadius:"50%",background:"#7fffb2"}
};
