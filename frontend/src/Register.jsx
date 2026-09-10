import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = ["Physician", "Nurse Practitioner", "Radiologist", "Admin"];
const DEPARTMENTS = ["Emergency Medicine","Intensive Care Unit","General Surgery","Oncology","Radiology","Paediatrics","Cardiology","Other"];

export default function Register({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:"", staffId:"", email:"", department:DEPARTMENTS[0], role:ROLES[0], password:"", confirmPassword:"" });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const update = f => e => setForm(p => ({...p, [f]: e.target.value}));

  const validate = () => {
    if (!form.fullName.trim())     return "Full name is required.";
    if (!form.staffId.trim())      return "Staff ID is required.";
    if (!form.email.includes("@")) return "Valid email is required.";
    if (form.password.length < 6)  return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    if (onRegister) {
      const result = await onRegister({
        fullName:   form.fullName,
        staffId:    form.staffId,
        email:      form.email,
        department: form.department,
        role:       form.role,
        password:   form.password,
      });

      setLoading(false);
      if (result && result.error) {
        setError(result.error);
        return;
      }
      navigate("/login");
    }
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse  { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes ecg    { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
        .reg-field { animation:fadeUp 0.45s ease both; }
        .reg-field:nth-child(1){animation-delay:0.1s}
        .reg-field:nth-child(2){animation-delay:0.17s}
        .reg-field:nth-child(3){animation-delay:0.24s}
        .reg-field:nth-child(4){animation-delay:0.31s}
        .reg-field:nth-child(5){animation-delay:0.38s}
        .reg-field:nth-child(6){animation-delay:0.45s}
        .reg-input {
          width:100%; background:rgba(255,255,255,0.15);
          border:1.5px solid rgba(255,255,255,0.3); border-radius:10px;
          color:#fff; font-family:'Nunito',sans-serif; font-size:13px;
          padding:11px 14px 11px 40px; outline:none; transition:all 0.2s;
        }
        .reg-input::placeholder { color:rgba(255,255,255,0.5); }
        .reg-input:focus { border-color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.22); }
        .reg-select {
          width:100%; background:rgba(255,255,255,0.15);
          border:1.5px solid rgba(255,255,255,0.3); border-radius:10px;
          color:#fff; font-family:'Nunito',sans-serif; font-size:13px;
          padding:11px 14px 11px 40px; outline:none; cursor:pointer; appearance:none;
        }
        .reg-select option { background:#0a7a8a; color:#fff; }
        .reg-btn {
          width:100%; background:#fff; color:#0a7a8a; border:none;
          border-radius:12px; font-family:'Nunito',sans-serif; font-size:14px;
          font-weight:800; padding:13px; cursor:pointer; transition:all 0.2s;
          box-shadow:0 4px 20px rgba(0,0,0,0.15);
        }
        .reg-btn:hover:not(:disabled) { background:#e0f7fa; transform:translateY(-1px); }
        .reg-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .ecg-path { stroke-dasharray:1000; stroke-dashoffset:1000; animation:ecg 3s ease forwards 0.5s; }
      `}</style>

      {/* Blobs */}
      <div style={styles.blob1}/><div style={styles.blob2}/><div style={styles.blob3}/>

      {/* Floating icons */}
      <div style={{...styles.floatIcon, top:"10%", left:"6%"}}>
        <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
      <div style={{...styles.floatIcon, top:"15%", right:"6%", animationDelay:"1s"}}>
        <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M18 2l4 4-14 14H4v-4L18 2z"/><line x1="9" y1="11" x2="13" y2="7"/>
        </svg>
      </div>
      <div style={{...styles.floatIcon, bottom:"20%", left:"5%", animationDelay:"0.5s"}}>
        <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>

      <div style={styles.ecgWrap}>
        <svg viewBox="0 0 800 60" style={{width:"100%",height:60}}>
          <path className="ecg-path" d="M0,30 L80,30 L100,30 L115,5 L130,55 L145,5 L160,30 L200,30 L215,5 L230,55 L245,5 L260,30 L800,30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div style={styles.topBar}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={styles.statusDot}/>
          <span style={styles.statusText}>New Personnel Registration · Clinical Vision Intelligence</span>
        </div>
        <span style={styles.clockText}>{new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</span>
      </div>

      <div style={styles.card}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:12,animation:"fadeUp 0.5s ease both 0.05s"}}>
          <svg viewBox="0 0 48 48" width={48} height={48}>
            <rect x="18" y="6" width="12" height="36" rx="5" fill="white" opacity="0.9"/>
            <rect x="6" y="18" width="36" height="12" rx="5" fill="white" opacity="0.9"/>
            <line x1="37" y1="11" x2="44" y2="4" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="44" cy="4" r="2.5" fill="rgba(255,255,255,0.7)"/>
          </svg>
        </div>

        <div style={{textAlign:"center",marginBottom:20,animation:"fadeUp 0.5s ease both 0.1s"}}>
          <div style={styles.cardTitle}>Create Account</div>
          <div style={styles.cardSub}>Clinical Vision Intelligence</div>
          <div style={styles.cardSubSmall}>Complete your clinical access profile</div>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="reg-field" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{position:"relative"}}>
                <div style={styles.fieldIcon}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </div>
                <input className="reg-input" placeholder="Full Name" value={form.fullName} onChange={update("fullName")}/>
              </div>
              <div style={{position:"relative"}}>
                <div style={styles.fieldIcon}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"/></svg>
                </div>
                <input className="reg-input" placeholder="Staff ID" value={form.staffId} onChange={update("staffId")}/>
              </div>
            </div>

            <div className="reg-field" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <input className="reg-input" type="email" placeholder="Email Address" value={form.email} onChange={update("email")}/>
            </div>

            <div className="reg-field" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{position:"relative"}}>
                <div style={styles.fieldIcon}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <select className="reg-select" value={form.department} onChange={update("department")}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{position:"relative"}}>
                <div style={styles.fieldIcon}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <select className="reg-select" value={form.role} onChange={update("role")}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="reg-field" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>
              </div>
              <input className="reg-input" type={showPass?"text":"password"} placeholder="Password" value={form.password} onChange={update("password")}/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={styles.eyeBtn}>{showPass?"Hide":"Show"}</button>
            </div>

            <div className="reg-field" style={{position:"relative"}}>
              <div style={styles.fieldIcon}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <input className="reg-input" type={showConfirm?"text":"password"} placeholder="Confirm Password" value={form.confirmPassword} onChange={update("confirmPassword")}/>
              <button type="button" onClick={()=>setShowConfirm(!showConfirm)} style={styles.eyeBtn}>{showConfirm?"Hide":"Show"}</button>
              {form.confirmPassword && (
                <span style={{position:"absolute",right:36,top:"50%",transform:"translateY(-50%)",fontSize:12,color:form.password===form.confirmPassword?"#7fffb2":"#ffb3b3",fontWeight:700}}>
                  {form.password===form.confirmPassword?"✓":"✗"}
                </span>
              )}
            </div>

            {error && <div style={styles.errorBox}>⚠ {error}</div>}

            <button className="reg-btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Create Clinical Account"}
            </button>
            
            <button type="button" onClick={()=>navigate("/login")} style={styles.link}>Already have an account? Login here</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  root:{position:"relative",width:"100vw",height:"100vh",background:"linear-gradient(135deg,#006d7e 0%,#00a3b5 40%,#00c9b5 100%)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",fontFamily:"'Nunito',sans-serif"},
  blob1:{position:"absolute",top:"-15%",left:"-10%",width:480,height:480,borderRadius:"50%",background:"rgba(255,255,255,0.08)"},
  blob2:{position:"absolute",bottom:"-20%",right:"-8%",width:560,height:560,borderRadius:"50%",background:"rgba(255,255,255,0.06)"},
  blob3:{position:"absolute",top:"30%",right:"25%",width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.04)"},
  floatIcon:{position:"absolute",animation:"float 4s ease-in-out infinite"},
  ecgWrap:{position:"absolute",bottom:0,left:0,right:0,opacity:0.6},
  topBar:{position:"absolute",top:0,left:0,right:0,padding:"10px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(0,0,0,0.1)",backdropFilter:"blur(4px)"},
  statusDot:{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#7fffb2",animation:"pulse 2s ease infinite"},
  statusText:{fontSize:11,color:"rgba(255,255,255,0.75)"},
  clockText:{fontSize:12,color:"rgba(255,255,255,0.75)",fontWeight:600},
  card:{position:"relative",zIndex:10,background:"rgba(255,255,255,0.12)",backdropFilter:"blur(20px)",border:"1.5px solid rgba(255,255,255,0.25)",borderRadius:24,padding:"28px 36px",width:"100%",maxWidth:460,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"},
  cardTitle:{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:"#fff"},
  cardSub:{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.9)"},
  cardSubSmall:{fontSize:11,color:"rgba(255,255,255,0.55)"},
  fieldIcon:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",zIndex:1},
  eyeBtn:{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:11},
  errorBox:{background:"rgba(255,80,80,0.2)",border:"1px solid rgba(255,80,80,0.4)",borderRadius:10,padding:"10px",fontSize:12,color:"#ffb3b3",textAlign:"center"},
  link:{background:"none",border:"none",color:"#fff",cursor:"pointer",textDecoration:"underline",fontSize:12,marginTop:10},
};
