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
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    if (onLogin) onLogin({ username, role });
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes ecg    { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
        .cvi-field {
          width:100%; background:rgba(255,255,255,0.15);
          border:1.5px solid rgba(255,255,255,0.3); border-radius:12px;
          color:#fff; font-family:'Nunito',sans-serif; font-size:14px;
          padding:13px 16px 13px 44px; outline:none; transition:all 0.25s;
          backdrop-filter:blur(4px);
        }
        .cvi-field::placeholder { color:rgba(255,255,255,0.5); }
        .cvi-field:focus { border-color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.22); box-shadow:0 0 0 3px rgba(255,255,255,0.1); }
        .cvi-field:-webkit-autofill { -webkit-box-shadow:0 0 0 1000px rgba(0,150,180,0.3) inset !important; -webkit-text-fill-color:white !important; }
        .cvi-select {
          width:100%; background:rgba(255,255,255,0.15);
          border:1.5px solid rgba(255,255,255,0.3); border-radius:12px;
          color:#fff; font-family:'Nunito',sans-serif; font-size:14px;
          padding:13px 16px 13px 44px; outline:none; cursor:pointer;
          appearance:none; backdrop-filter:blur(4px); transition:all 0.25s;
        }
        .cvi-select option { background:#0a7a8a; color:#fff; }
        .cvi-select:focus { border-color:rgba(255,255,255,0.7); }
        .login-btn {
          width:100%; background:#fff; color:#0a7a8a; border:none;
          border-radius:12px; font-family:'Nunito',sans-serif; font-size:15px;
          font-weight:800; letter-spacing:0.05em; padding:14px; cursor:pointer;
          transition:all 0.2s; box-shadow:0 4px 20px rgba(0,0,0,0.15);
        }
        .login-btn:hover:not(:disabled) { background:#e0f7fa; transform:translateY(-1px); box-shadow:0 6px 24px rgba(0,0,0,0.2); }
        .login-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .field-wrap { animation:fadeUp 0.5s ease both; }
        .field-wrap:nth-child(1){animation-delay:0.2s}
        .field-wrap:nth-child(2){animation-delay:0.3s}
        .field-wrap:nth-child(3){animation-delay:0.4s}
        .field-wrap:nth-child(4){animation-delay:0.5s}
        .field-wrap:nth-child(5){animation-delay:0.6s}
        .ecg-path { stroke-dasharray:1000; stroke-dashoffset:1000; animation:ecg 3s ease forwards 0.5s; }
      `}</style>

      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      {/* Floating medical icons */}
      <div style={{...styles.floatIcon, top:"12%", left:"8%"}}>
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M3 3c0 0 3 2 3 5s-3 5-3 5M21 3c0 0-3 2-3 5s3 5 3 5M3 13c0 0 3 2 3 5s-3 5-3 5M21 13c0 0-3 2-3 5s3 5 3 5"/>
          <line x1="6" y1="5" x2="18" y2="5"/><line x1="6" y1="8" x2="18" y2="8"/>
          <line x1="6" y1="15" x2="18" y2="15"/><line x1="6" y1="18" x2="18" y2="18"/>
        </svg>
      </div>
      <div style={{...styles.floatIcon, top:"18%", right:"7%", animationName:"float2"}}>
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M18 2l4 4-14 14H4v-4L18 2z"/><line x1="9" y1="11" x2="13" y2="7"/>
          <line x1="11" y1="13" x2="15" y2="9"/><line x1="2" y1="22" x2="6" y2="18"/>
        </svg>
      </div>
      <div style={{...styles.floatIcon, bottom:"22%", left:"5%", animationDelay:"0.5s"}}>
        <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <div style={{...styles.floatIcon, bottom:"20%", right:"8%", animationDelay:"1.2s"}}>
        <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>

      {/* ECG bottom */}
      <div style={styles.ecgWrap}>
        <svg viewBox="0 0 800 60" style={{width:"100%", height:60}}>
          <path className="ecg-path"
            d="M0,30 L80,30 L100,30 L115,5 L130,55 L145,5 L160,30 L200,30 L215,5 L230,55 L245,5 L260,30 L320,30 L335,5 L350,55 L365,5 L380,30 L440,30 L455,5 L470,55 L485,5 L500,30 L560,30 L575,5 L590,55 L605,5 L620,30 L700,30 L715,5 L730,55 L745,5 L760,30 L800,30"
            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <span style={styles.statusDot} />
          <span style={styles.statusText}>System Online · MONAI Active · YOLOv11 Ready</span>
        </div>
        <span style={styles.clockText}>
          {tick.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}
          &nbsp;&nbsp;
          {tick.toLocaleTimeString("en-GB",{hour12:false})}
        </span>
      </div>

      {/* Glass card */}
      <div style={styles.card}>
        {/* Medical cross */}
        <div style={{display:"flex", justifyContent:"center", marginBottom:16, animation:"fadeUp 0.5s ease both 0.05s"}}>
          <svg viewBox="0 0 48 48" width={52} height={52}>
            <rect x="18" y="6" width="12" height="36" rx="5" fill="white" opacity="0.9"/>
            <rect x="6" y="18" width="36" height="12" rx="5" fill="white" opacity="0.9"/>
            <line x1="37" y1="11" x2="44" y2="4" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="44" cy="4" r="2.5" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>

        {/* Heading */}
        <div style={{textAlign:"center", marginBottom:28, animation:"fadeUp 0.5s ease both 0.1s"}}>
          <div style={styles.cardTitle}>Welcome Back</div>
          <div style={styles.cardSub}>Clinical Vision Intelligence</div>
          <div style={styles.cardSubSmall}>Automated Injection Monitoring System</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{display:"flex", flexDirection:"column", gap:14}}>

            <div className="field-wrap" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </div>
              <input className="cvi-field" type="text" placeholder="Username or Staff ID"
                value={username} onChange={e => setUsername(e.target.value)} />
            </div>

            <div className="field-wrap" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
              </div>
              <input className="cvi-field" type={showPass?"text":"password"} placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} style={{paddingRight:44}}/>
              <button type="button" onClick={() => setShowPass(p=>!p)} style={styles.eyeBtn}>
                {showPass
                  ? <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>

            <div className="field-wrap" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <select className="cvi-select" value={role} onChange={e => setRole(e.target.value)}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
              <div style={styles.selectArrow}>▾</div>
            </div>

            {error && (
              <div style={styles.errorBox}>⚠ {error}</div>
            )}

            <div className="field-wrap">
              <button className="login-btn" type="submit" disabled={loading}>
                {loading
                  ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                      <span style={{width:16,height:16,border:"2.5px solid #0a7a8a",borderTop:"2.5px solid transparent",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>
                      Authenticating...
                    </span>
                  : "Sign In"
                }
              </button>
            </div>

            <div style={styles.divider}>
              <div style={styles.dividerLine}/><span style={styles.dividerText}>or</span><div style={styles.dividerLine}/>
            </div>

            <div className="field-wrap" style={{textAlign:"center"}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.7)",fontFamily:"'Nunito',sans-serif"}}>
                Don't have an account?{" "}
              </span>
              <button type="button" onClick={() => navigate("/register")} style={{
                background:"none",border:"none",color:"#fff",fontSize:13,
                fontFamily:"'Nunito',sans-serif",fontWeight:700,cursor:"pointer",textDecoration:"underline"
              }}>Register here</button>
            </div>
          </div>
        </form>

        <div style={styles.cardFooter}>
          <span style={styles.footerDot}/>
          Authorised personnel only · All sessions are logged
        </div>
      </div>
    </div>
  );
}

const styles = {
  root:{position:"relative",width:"100vw",height:"100vh",background:"linear-gradient(135deg,#006d7e 0%,#00a3b5 40%,#00c9b5 100%)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontFamily:"'Nunito',sans-serif"},
  blob1:{position:"absolute",top:"-15%",left:"-10%",width:480,height:480,borderRadius:"50%",background:"rgba(255,255,255,0.08)",filter:"blur(2px)"},
  blob2:{position:"absolute",bottom:"-20%",right:"-8%",width:560,height:560,borderRadius:"50%",background:"rgba(255,255,255,0.06)"},
  blob3:{position:"absolute",top:"30%",left:"20%",width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.04)"},
  floatIcon:{position:"absolute",animation:"float 4s ease-in-out infinite"},
  ecgWrap:{position:"absolute",bottom:0,left:0,right:0,opacity:0.6},
  topBar:{position:"absolute",top:0,left:0,right:0,padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(0,0,0,0.1)",backdropFilter:"blur(4px)"},
  statusDot:{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#7fffb2",boxShadow:"0 0 8px #7fffb2",animation:"pulse 2s ease infinite"},
  statusText:{fontSize:11,color:"rgba(255,255,255,0.75)",letterSpacing:"0.06em"},
  clockText:{fontSize:12,color:"rgba(255,255,255,0.75)",fontWeight:600,letterSpacing:"0.06em"},
  card:{position:"relative",zIndex:10,background:"rgba(255,255,255,0.12)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.25)",borderRadius:24,padding:"36px 40px",width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.3)",animation:"fadeUp 0.6s ease both"},
  cardTitle:{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:"#fff",marginBottom:4},
  cardSub:{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)",letterSpacing:"0.04em",marginBottom:2},
  cardSubSmall:{fontSize:11,color:"rgba(255,255,255,0.55)",letterSpacing:"0.06em"},
  fieldIcon:{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",zIndex:1},
  eyeBtn:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center"},
  selectArrow:{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.6)",fontSize:14,pointerEvents:"none"},
  errorBox:{background:"rgba(255,80,80,0.15)",border:"1px solid rgba(255,80,80,0.4)",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#ffb3b3",fontFamily:"'Nunito',sans-serif"},
  divider:{display:"flex",alignItems:"center",gap:12},
  dividerLine:{flex:1,height:1,background:"rgba(255,255,255,0.2)"},
  dividerText:{fontSize:12,color:"rgba(255,255,255,0.5)"},
  cardFooter:{marginTop:20,fontSize:10,color:"rgba(255,255,255,0.45)",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:6,letterSpacing:"0.05em"},
  footerDot:{display:"inline-block",width:6,height:6,borderRadius:"50%",background:"#7fffb2"},
};
