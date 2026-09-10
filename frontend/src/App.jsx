import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import LandingPage  from "./LandingPage";
import Login        from "./Login";
import Register     from "./Register";
import Dashboard    from "./Dashboard";
import { NotFoundPage } from "./healthcare-components";

const SESSION_KEY    = "cvi_user_session";
const ACCOUNTS_KEY   = "cvi_registered_accounts";
const LOGS_KEY       = "cvi_audit_log";

// Simple SHA-256 hash (browser-native) with fallback
async function hashPassword(password) {
  try {
    if (window.crypto && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }
  } catch (e) { console.error("Hashing fallback triggered", e); }
  return btoa(password); // Simple base64 fallback for non-secure contexts
}

// ── Auth route ───────────────────────────────────────────────────────────────
function AuthRoute({ user, children, allowLoggedIn = false }) {
  const location = useLocation();
  const force = new URLSearchParams(location.search).get("force");
  
  // If the user is logged in, redirect them to the dashboard automatically
  // UNLESS they are explicitly trying to "force" a new login/registration.
  if (user && !force && !allowLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function ProtectedRoute({ user, children, adminOnly = false }) {
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "Admin") return <Navigate to="/dashboard" replace />;
  return children;
}

// ── App Component ────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [loginHistory, setLoginHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(LOGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const handleLogin = useCallback((userData) => {
    const session = { ...userData, loginTime: new Date().toISOString() };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch {}
    
    // Record login history
    const history = JSON.parse(localStorage.getItem("cvi_login_history") || "[]");
    history.unshift({
      username: userData.username,
      role: userData.role,
      loginTime: session.loginTime,
      logoutTime: null
    });
    localStorage.setItem("cvi_login_history", JSON.stringify(history.slice(0, 50)));
    
    setUser(session);
  }, []);

  const handleLogout = useCallback(() => {
    setUser((currentUser) => {
      if (currentUser) {
        const history = JSON.parse(localStorage.getItem("cvi_login_history") || "[]");
        const record = history.find(h => h.username === currentUser.username && !h.logoutTime);
        if (record) {
          record.logoutTime = new Date().toISOString();
          localStorage.setItem("cvi_login_history", JSON.stringify(history));
        }
      }
      return null;
    });
    localStorage.removeItem(SESSION_KEY);
  }, []);

  const handleRegister = useCallback(async (registrationData) => {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    let accounts = [];
    try { accounts = raw ? JSON.parse(raw) : []; } catch { accounts = []; }

    // Prevent duplicate staff ID
    if (accounts.some(a => a.staffId === registrationData.staffId)) {
      return { error: "Staff ID already registered." };
    }

    const hashedPassword = await hashPassword(registrationData.password);
    
    const newAccount = {
      fullName:     registrationData.fullName,
      staffId:      registrationData.staffId,
      email:        registrationData.email,
      department:   registrationData.department,
      role:         registrationData.role,
      passwordHash: hashedPassword,
      registeredAt: new Date().toISOString(),
    };
    accounts.push(newAccount);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    return { success: true };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        
        <Route
          path="/login"
          element={
            <AuthRoute user={user}>
              <Login onLogin={handleLogin} />
            </AuthRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <AuthRoute user={user}>
              <Register onRegister={handleRegister} />
            </AuthRoute>
          }
        />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} onLogout={handleLogout} loginHistory={loginHistory} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
